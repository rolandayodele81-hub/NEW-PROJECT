/**
 * HTTP entry points. Both verbs share one JSON envelope: {ok, data} or {ok:false, error}.
 * All writes take a script lock — this app trades a little latency for not
 * racing concurrent edits against a single spreadsheet.
 */

function doGet(e) {
  try {
    var action = String((e.parameter || {}).action || 'list').toLowerCase();
    if (action === 'bootstrap') return jsonOutput_({ ok: true, data: bootstrapData_() });
    if (action === 'list') return jsonOutput_({ ok: true, data: Repository.list(e.parameter.resource) });
    if (action === 'get') return jsonOutput_({ ok: true, data: Repository.find(e.parameter.resource, e.parameter.id) });
    return jsonOutput_({ ok: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var body = JSON.parse((e.postData && e.postData.contents) || '{}');
    var action = String(body.action || '').toLowerCase();
    switch (action) {
      case 'create': {
        var created = Repository.insert(body.resource, body.record);
        if (body.resource === 'leaveRequests') {
          try {
            var customEmail = body.customEmail || (body.record && body.record.customEmail);
            var notifResult = notifyLeaveRequested_(created, body.appUrl, body, customEmail);
            if (notifResult) {
              created._hrEmails = notifResult.hrEmails;
              created._sentEmails = notifResult.sentEmails;
              created._hrEmailSent = notifResult.sent;
              created._emailError = notifResult.error;
            }
          } catch (e) {
            Logger.log('Error notifying leave request: ' + e);
            created._emailError = String(e);
          }
        }
        return jsonOutput_({ ok: true, data: created });
      }
      case 'update':
        if (body.resource === 'users') {
          var plainPassword = body.patch && body.patch.password;
          if (plainPassword) {
            body.patch.passwordHash = hashPassword_(plainPassword);
            delete body.patch.password;
          }
          var emailCfg = body.customEmail || (body.patch && body.patch.customEmail);
          if (body.patch && body.patch.customEmail) delete body.patch.customEmail;
          var originalUser = Repository.find('users', body.id);
          var updatedUser = Repository.update(body.resource, body.id, body.patch);
          var emailResult = null;
          if (body.notifyUser !== false) {
            emailResult = Auth.notifyProfileUpdated(originalUser, updatedUser, plainPassword, body.editorName, body.appUrl, emailCfg);
          }
          var cleanUser = stripExcluded_(updatedUser, ['passwordHash']);
          if (emailResult) {
            cleanUser._emailSent = emailResult.emailSent;
            cleanUser._emailError = emailResult.emailError;
          }
          return jsonOutput_({ ok: true, data: cleanUser });
        }
        if (body.resource === 'leaveRequests') {
          var customEmail = body.customEmail || (body.patch && body.patch.customEmail) || null;
          if (body.patch && body.patch.customEmail) delete body.patch.customEmail;
          var originalLeave = Repository.find('leaveRequests', body.id);
          var updatedLeave = Repository.update(body.resource, body.id, body.patch);
          try {
            var notifResult = notifyLeaveStatusChanged_(originalLeave, updatedLeave, body.editorName, body.appUrl, customEmail);
            if (notifResult) {
              updatedLeave._candidateEmail = notifResult.candidateEmail;
              updatedLeave._emailSent = notifResult.sent;
              updatedLeave._emailError = notifResult.error;
              updatedLeave._usedCustomEmail = notifResult.usedCustomEmail;
            }
          } catch (e) {
            Logger.log('Error notifying leave status change: ' + e);
            updatedLeave._emailError = String(e);
          }
          return jsonOutput_({ ok: true, data: updatedLeave });
        }
        return jsonOutput_({ ok: true, data: Repository.update(body.resource, body.id, body.patch) });
      case 'remove':
        return jsonOutput_({ ok: true, data: Repository.remove(body.resource, body.id) });
      case 'login': {
        var user = Auth.login(body.email, body.password);
        return user
          ? jsonOutput_({ ok: true, data: user })
          : jsonOutput_({ ok: false, error: 'Invalid login credentials' });
      }
      case 'register': {
        var emailCfg = body.customEmail || (body.account && body.account.customEmail);
        var regResult = Auth.register(body.account, body.appUrl, emailCfg);
        var regUser = regResult.user;
        regUser._emailSent = regResult.emailSent;
        regUser._emailError = regResult.emailError;
        return jsonOutput_({ ok: true, data: regUser });
      }
      case 'forgotpassword':
        return jsonOutput_({ ok: true, data: Auth.forgotPassword(body.email, body.appUrl) });
      case 'uploaddoc': {
        var folder = DriveApp.getFolderById(getDocFolderId_());
        var bytes = Utilities.base64Decode(body.base64);
        var blob = Utilities.newBlob(bytes, body.mimeType || 'application/octet-stream', body.fileName);
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        return jsonOutput_({ ok: true, data: { url: file.getUrl(), fileId: file.getId() } });
      }
      default:
        return jsonOutput_({ ok: false, error: 'Unknown action: ' + action });
    }
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function jsonOutput_(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}

function bootstrapData_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var allSheets = ss.getSheets();
  var sheetMap = {};
  allSheets.forEach(function (s) { sheetMap[s.getName()] = s; });

  var data = {};
  Object.keys(ENTITIES).forEach(function (key) {
    var cfg = ENTITIES[key];
    var sheet = sheetMap[cfg.sheet];
    if (!sheet) {
      data[key] = [];
      return;
    }
    var values = sheet.getDataRange().getValues();
    var headers = values.shift() || [];
    data[key] = values.map(function (row) {
      return stripExcluded_(rowToObject_(headers, row, cfg.jsonFields), cfg.publicExclude);
    });
  });
  return data;
}

function getHrEmails_(requestBody) {
  var hrEmails = [];

  // 1. Check if client explicitly provided hrEmails
  if (requestBody) {
    var fromBody = requestBody.hrEmails || (requestBody.record && requestBody.record.hrEmails);
    if (fromBody) {
      if (typeof fromBody === 'string') fromBody = [fromBody];
      if (Array.isArray(fromBody)) {
        fromBody.forEach(function (e) {
          var em = String(e || '').trim();
          if (em && hrEmails.indexOf(em) === -1) hrEmails.push(em);
        });
      }
    }
  }

  // 2. Fetch all HR & System Administrator users from the sheet
  try {
    var users = Repository.list('users');
    users.forEach(function (u) {
      if (!u.email) return;
      var role = String(u.role || '').toLowerCase();
      if (role === 'hr' || role === 'system administrator') {
        var em = String(u.email).trim();
        if (em && hrEmails.indexOf(em) === -1) {
          hrEmails.push(em);
        }
      }
    });
  } catch (err) {
    Logger.log('Error getting HR emails from users sheet: ' + err);
  }

  // 3. Check Script Properties for HR_EMAIL
  try {
    var propEmail = PropertiesService.getScriptProperties().getProperty('HR_EMAIL');
    if (propEmail && hrEmails.indexOf(propEmail) === -1) hrEmails.push(propEmail.trim());
  } catch (_) {}

  // 4. Always include the effective script owner (the authenticated Google Account)
  try {
    var effectiveEmail = Session.getEffectiveUser().getEmail();
    if (effectiveEmail && hrEmails.indexOf(effectiveEmail) === -1) {
      hrEmails.push(effectiveEmail.trim());
    }
  } catch (_) {}

  try {
    var activeEmail = Session.getActiveUser().getEmail();
    if (activeEmail && hrEmails.indexOf(activeEmail) === -1) {
      hrEmails.push(activeEmail.trim());
    }
  } catch (_) {}

  return hrEmails;
}

function notifyLeaveRequested_(leave, appUrl, requestBody, customEmail) {
  if (!leave) return null;

  var days = leave.daysCount || 1;
  var name = leave.userName || 'An employee';
  var start = leave.startDate || '';
  var end = leave.endDate || '';
  var dates = (!end || start === end) ? start : (start + ' to ' + end);
  var leaveType = leave.type || 'Time-Off';
  var portalUrl = appUrl ? appUrl.replace(/\/[^\/]*$/, '/leave-approvals.html') : "Your organization's PDMS portal URL";

  // 1. In-app platform notification for HR
  try {
    var notifRecord = {
      title: 'New Time-Off Request',
      msg: name + ' requested ' + days + ' off-day(s) (' + dates + ') for ' + leaveType + '.',
      icon: 'calendar',
      link: 'leave-approvals.html',
      actor: name,
      actorRole: leave.userRole || '',
      time: new Date().toISOString(),
      unread: true,
      recipientRole: 'HR,System Administrator',
      recipientId: '',
      recipientName: '',
      projectId: ''
    };
    Repository.insert('notifications', notifRecord);
  } catch (err) {
    Logger.log('Failed to insert HR notification: ' + err);
  }

  // 2. Email notification to HR
  var hrEmails = getHrEmails_(requestBody);
  var sentEmails = [];
  var lastError = null;

  var emailCfg = customEmail || (requestBody && (requestBody.customEmail || (requestBody.record && requestBody.record.customEmail))) || null;
  if (typeof emailCfg === 'string') {
    try { emailCfg = JSON.parse(emailCfg); } catch (_) {}
  }
  var customSubj = (emailCfg && (emailCfg.subject || emailCfg.title)) ? String(emailCfg.subject || emailCfg.title).trim() : null;
  var customMsg = (emailCfg && (emailCfg.body || emailCfg.message || emailCfg.text || emailCfg.content)) ? String(emailCfg.body || emailCfg.message || emailCfg.text || emailCfg.content).trim() : null;

  if (hrEmails.length > 0) {
    var defaultSubj = 'New Time-Off Request: ' + name + ' (' + dates + ')';
    var defaultBody = 'Hello HR Team,\n\n' +
               name + ' (' + (leave.userEmail || 'No email provided') + (leave.dept ? (', ' + leave.dept) : '') + ') has submitted a new time-off request.\n\n' +
               '• Leave Category: ' + leaveType + '\n' +
               '• Duration: ' + days + ' day(s)\n' +
               '• Date Range: ' + dates + '\n' +
               '• Reason / Handover Notes:\n' + (leave.reason || 'None provided') + '\n\n' +
               'You can review and approve or reject this request on the PDMS portal here:\n' +
               portalUrl + '\n\n' +
               'Best regards,\n' +
               'PSE PDMS System';

    var subject = customSubj || defaultSubj;
    var body = customMsg || defaultBody;

    hrEmails.forEach(function (toEmail) {
      try {
        MailApp.sendEmail(toEmail, subject, body);
        sentEmails.push(toEmail);
      } catch (err) {
        lastError = err.toString();
        Logger.log('Failed to send leave email to HR (' + toEmail + '): ' + err);
      }
    });
  }

  return {
    hrEmails: hrEmails,
    sentEmails: sentEmails,
    sent: sentEmails.length > 0,
    error: lastError
  };
}

function notifyLeaveStatusChanged_(originalLeave, updatedLeave, editorName, appUrl, customEmail) {
  if (!updatedLeave) return null;
  var status = updatedLeave.status;
  if (status !== 'Approved' && status !== 'Rejected') return null;
  if (originalLeave && originalLeave.status === status) return null; // avoid duplicate notifications

  var candidateEmail = updatedLeave.userEmail || (originalLeave && originalLeave.userEmail) || '';
  var candidateName = updatedLeave.userName || (originalLeave && originalLeave.userName) || '';
  var candidateId = updatedLeave.userId || (originalLeave && originalLeave.userId) || '';

  if ((!candidateEmail || !candidateName) && candidateId) {
    try {
      var candidate = Repository.find('users', candidateId);
      if (candidate) {
        if (!candidateEmail && candidate.email) candidateEmail = candidate.email;
        if (!candidateName && candidate.name) candidateName = candidate.name;
      }
    } catch (_) {}
  }
  if (!candidateName) candidateName = 'Staff Member';

  var reviewer = editorName || updatedLeave.reviewerName || 'HR Team';
  var days = updatedLeave.daysCount || (originalLeave && originalLeave.daysCount) || 1;
  var start = updatedLeave.startDate || (originalLeave && originalLeave.startDate) || '';
  var end = updatedLeave.endDate || (originalLeave && originalLeave.endDate) || '';
  var dateDisplay = (!end || start === end) ? start : (start + ' to ' + end);
  var profileUrl = appUrl ? appUrl.replace(/\/[^\/]*$/, '/profile.html') : "Your organization's PDMS portal URL";
  var reviewNote = updatedLeave.reviewNote || '';
  var isApproved = (status === 'Approved');

  // 1. In-app platform notification for Candidate
  try {
    var notifTitle = isApproved ? 'Time-Off Request Approved' : 'Time-Off Request Rejected';
    var notifMsg = isApproved
      ? ('Your request for ' + days + ' off-day(s) (' + dateDisplay + ') has been approved by HR.' + (reviewNote ? (' Note: ' + reviewNote) : ''))
      : ('Your request for off-days (' + dateDisplay + ') was not approved. Reason: ' + (reviewNote || 'Not approved by HR'));

    var notifRecord = {
      title: notifTitle,
      msg: notifMsg,
      icon: isApproved ? 'check' : 'alert-triangle',
      link: 'profile.html',
      actor: reviewer,
      actorRole: 'HR',
      time: new Date().toISOString(),
      unread: true,
      recipientRole: '',
      recipientId: candidateEmail || candidateId || '',
      recipientName: candidateName,
      projectId: ''
    };
    Repository.insert('notifications', notifRecord);
  } catch (err) {
    Logger.log('Failed to insert candidate notification: ' + err);
  }

  // 2. Email notification to Candidate
  var emailSent = false;
  var emailError = null;

  var emailCfg = customEmail || null;
  if (typeof emailCfg === 'string') {
    try { emailCfg = JSON.parse(emailCfg); } catch (_) {}
  }
  var customSubj = (emailCfg && (emailCfg.subject || emailCfg.title || emailCfg.customSubject)) ? String(emailCfg.subject || emailCfg.title || emailCfg.customSubject).trim() : null;
  var customMsg = (emailCfg && (emailCfg.body || emailCfg.message || emailCfg.text || emailCfg.content || emailCfg.customBody)) ? String(emailCfg.body || emailCfg.message || emailCfg.text || emailCfg.content || emailCfg.customBody).trim() : null;

  if (candidateEmail) {
    var subject = '';
    var body = '';

    if (isApproved) {
      subject = customSubj || ('PSE PDMS - Time-Off Request Approved (' + dateDisplay + ')');
      body = customMsg || ('Hello ' + candidateName + ',\n\n' +
             'Good news! Your time-off request has been APPROVED by ' + reviewer + '.\n\n' +
             '• Leave Category: ' + (updatedLeave.type || 'Time-Off') + '\n' +
             '• Duration: ' + days + ' day(s)\n' +
             '• Date Range: ' + dateDisplay + '\n' +
             (reviewNote ? ('• Note from HR: ' + reviewNote + '\n') : '') +
             '• Reviewed At: ' + (updatedLeave.reviewedAt || new Date().toISOString()) + '\n\n' +
             'You can view your updated leave balance and history on your Profile page:\n' +
             profileUrl + '\n\n' +
             'Best regards,\n' +
             'PSE HR Team');
    } else {
      subject = customSubj || ('PSE PDMS - Time-Off Request Update (' + dateDisplay + ')');
      body = customMsg || ('Hello ' + candidateName + ',\n\n' +
             'Your time-off request for ' + dateDisplay + ' has been reviewed by ' + reviewer + ' and was NOT approved.\n\n' +
             '• Leave Category: ' + (updatedLeave.type || 'Time-Off') + '\n' +
             '• Duration: ' + days + ' day(s)\n' +
             '• Date Range: ' + dateDisplay + '\n' +
             '• Reason / Note: ' + (reviewNote || 'Not approved by HR') + '\n' +
             '• Reviewed At: ' + (updatedLeave.reviewedAt || new Date().toISOString()) + '\n\n' +
             'If you have questions regarding this decision, please speak directly with your HR representative or manager.\n\n' +
             'Best regards,\n' +
             'PSE HR Team');
    }

    try {
      MailApp.sendEmail(candidateEmail, subject, body);
      emailSent = true;
    } catch (err) {
      emailError = err.toString();
      Logger.log('Failed to send leave status email to ' + candidateEmail + ': ' + err);
    }
  }

  return {
    candidateEmail: candidateEmail,
    sent: emailSent,
    error: emailError,
    usedCustomEmail: !!(customSubj || customMsg)
  };
}
