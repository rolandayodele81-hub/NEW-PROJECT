/**
 * One-time setup. Open this project in the Apps Script editor, select
 * initializeSheets from the function dropdown, and click Run once.
 * Re-running is safe — it only creates sheets/headers/seed rows that don't
 * already exist and never touches sheets that already have data.
 */
function initializeSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var seed = {
    Departments: {
      headers: ['id', 'name', 'head', 'count', 'color'],
      rows: []
    },
    Users: {
      headers: ['id', 'name', 'email', 'passwordHash', 'role', 'dept', 'status', 'availability', 'workload', 'phone', 'joined', 'birthday', 'dateOfEntry'],
      textColumns: ['joined', 'birthday', 'dateOfEntry'],
      rows: [
        ['U000', 'System Administrator', 'admin@pse.com', hashPassword_('Admin@2026!'), 'System Administrator', 'Information Technology', 'Active', 'Available', 0, '+0000000000', '2026-01-15', ''],
        ['U001', 'HR Manager', 'hr@pse.com', hashPassword_('HR@2026!'), 'HR', 'Human Resources', 'Active', 'Available', 0, '+0000000000', '2026-01-15', '']
      ]
    },
    Consultants: {
      headers: ['id', 'name', 'email', 'role', 'dept', 'status', 'availability', 'workload', 'phone', 'joined', 'specialty', 'rate', 'projects', 'rating'],
      textColumns: ['joined'],
      rows: []
    },
    Clients: {
      headers: ['id', 'name', 'industry', 'contact', 'email', 'phone', 'address', 'projects', 'revenue'],
      rows: []
    },
    Projects: {
      headers: ['id', 'name', 'client', 'type', 'dept', 'workstream', 'sales', 'pm', 'lead', 'consultants', 'priority', 'status', 'stage', 'createdByRole', 'projectOwnerId', 'projectOwnerName', 'progress', 'start', 'due', 'actualCompletion', 'completion', 'negotiatedPrice', 'awardValue', 'requestedNegotiatedPrice', 'requestedStatus', 'previousStatus', 'priceUpdatePending', 'description', 'files', 'remarks', 'privateTasks', 'documents', 'milestones', 'subStatus', 'subStatuses'],
      textColumns: ['start', 'due', 'actualCompletion', 'completion', 'negotiatedPrice', 'awardValue', 'requestedNegotiatedPrice'],
      rows: []
    },
    Notifications: {
      headers: ['id', 'title', 'msg', 'icon', 'link', 'actor', 'actorRole', 'time', 'unread'],
      rows: []
    },
    Threads: {
      headers: ['id', 'user', 'messages', 'unread', 'last'],
      rows: []
    },
    Activities: {
      headers: ['id', 'user', 'role', 'action', 'target', 'time'],
      rows: []
    },
    Reviews: {
      headers: ['id', 'author', 'authorRole', 'projectId', 'projectName', 'message', 'time', 'comments'],
      rows: []
    },
    Issues: {
      headers: ['id', 'projectId', 'projectName', 'author', 'authorRole', 'message', 'time'],
      textColumns: ['time'],
      rows: []
    }
  };

  Object.keys(seed).forEach(function (sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    var isNew = !sheet;
    if (isNew) sheet = ss.insertSheet(sheetName);

    var def = seed[sheetName];

    // Always write the header row so column names stay in sync with code,
    // even on existing sheets. Data rows are never touched.
    sheet.getRange(1, 1, 1, def.headers.length).setValues([def.headers]);

    // Force date-like columns to stay plain text on every run.
    (def.textColumns || []).forEach(function (colName) {
      var colIndex = def.headers.indexOf(colName) + 1;
      if (colIndex > 0) sheet.getRange(2, colIndex, sheet.getMaxRows() - 1, 1).setNumberFormat('@');
    });

    if (isNew && def.rows.length) {
      sheet.getRange(2, 1, def.rows.length, def.headers.length).setValues(def.rows);
    }

    // Bold + frozen header row, applied every run (including sheets that
    // already had data) so it's consistent across the whole spreadsheet.
    sheet.getRange(1, 1, 1, def.headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  });

  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && defaultSheet.getLastRow() === 0 && defaultSheet.getLastColumn() === 0) {
    ss.deleteSheet(defaultSheet);
  }

  Logger.log('Sheets initialized.');
}

/**
 * Utility function to forcibly reset or create the default Admin and HR users
 * with the correct password salt. Run this once from the editor if you are
 * locked out or manually added them to the sheet without hashing.
 */
function resetDefaultUsers() {
  var adminRecord = {
    id: 'U000', name: 'System Administrator', email: 'admin@pse.com', role: 'System Administrator',
    dept: 'Information Technology', status: 'Active', availability: 'Available', workload: 0,
    phone: '+0000000000', joined: '2026-01-15', birthday: '', dateOfEntry: ''
  };
  var hrRecord = {
    id: 'U001', name: 'HR Manager', email: 'hr@pse.com', role: 'HR',
    dept: 'Human Resources', status: 'Active', availability: 'Available', workload: 0,
    phone: '+0000000000', joined: '2026-01-15', birthday: '', dateOfEntry: ''
  };
  
  [
    { record: adminRecord, password: 'Admin@2026!' },
    { record: hrRecord, password: 'HR@2026!' }
  ].forEach(function(u) {
    var existing = Repository.list('users').find(function(row) {
      return String(row.email).toLowerCase() === u.record.email;
    });
    
    if (existing) {
      Repository.update('users', existing.id, { passwordHash: hashPassword_(u.password) });
      Logger.log('Reset password for existing user: ' + u.record.email);
    } else {
      u.record.passwordHash = hashPassword_(u.password);
      Repository.insert('users', u.record);
      Logger.log('Created new user: ' + u.record.email);
    }
  });
}
