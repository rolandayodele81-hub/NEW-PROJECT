/**
 * Login/registration. Kept separate from Repository so password handling
 * never leaks into the generic CRUD path — the Users sheet is otherwise
 * just another entity.
 */

function getPasswordSalt_() {
  var props = PropertiesService.getScriptProperties();
  var salt = props.getProperty('PASSWORD_SALT');
  if (!salt) {
    salt = Utilities.getUuid();
    props.setProperty('PASSWORD_SALT', salt);
  }
  return salt;
}

function hashPassword_(password) {
  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    getPasswordSalt_() + String(password)
  );
  return digest.map(function (b) {
    return ((b < 0 ? b + 256 : b)).toString(16).padStart(2, '0');
  }).join('');
}

function findUserByEmail_(email) {
  var target = String(email || '').trim().toLowerCase();
  var match = Repository.list('users').filter(function (u) {
    return String(u.email || '').trim().toLowerCase() === target;
  });
  return match.length ? match[0] : null;
}

var Auth = {
  login: function (email, password) {
    var user = findUserByEmail_(email);
    if (!user || user.passwordHash !== hashPassword_(password)) return null;
    return stripExcluded_(user, ['passwordHash']);
  },

  register: function (account, appUrl) {
    if (findUserByEmail_(account.email)) {
      throw new Error('An account with that email already exists');
    }
    var record = Object.assign({}, account);
    var plainPassword = record.password;
    record.passwordHash = hashPassword_(plainPassword);
    delete record.password;
    record.status = record.status || 'Active';
    record.availability = record.availability || 'Available';
    record.workload = record.workload || 0;
    record.joined = record.joined || new Date().toISOString().slice(0, 10);
    var saved = Repository.insert('users', record);
    
    try {
      var subject = "Welcome to PSE PDMS - Your Account Details";
      var body = "Hello " + saved.name + ",\n\n" +
                 "Your account has been successfully created on the PSE PDMS portal as a " + saved.role + ".\n\n" +
                 "Here are your login credentials:\n" +
                 "Email: " + saved.email + "\n" +
                 "Password: " + plainPassword + "\n\n" +
                 "You can log in to the portal here:\n" + 
                 (appUrl || "Your organization's PDMS portal URL") + "\n\n" +
                 "Please log in and update your password from your profile page as soon as possible.\n\n" +
                 "Best regards,\n" +
                 "PSE HR Team";
      MailApp.sendEmail(saved.email, subject, body);
    } catch(e) {
      Logger.log("Failed to send welcome email to " + saved.email + ": " + e.toString());
    }
    
    return stripExcluded_(saved, ['passwordHash']);
  },

  forgotPassword: function (email, appUrl) {
    var user = findUserByEmail_(email);
    if (!user) {
      throw new Error('No registered account found with this email address.');
    }
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var newPassword = '';
    for (var i = 0; i < 8; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    var patch = { passwordHash: hashPassword_(newPassword) };
    Repository.update('users', user.id, patch);

    try {
      var subject = "PSE PDMS - Your New Login Credentials";
      var body = "Hello " + (user.name || "User") + ",\n\n" +
                 "We received a request to reset your PSE PDMS password.\n\n" +
                 "Here are your new login credentials:\n" +
                 "Email: " + user.email + "\n" +
                 "New Password: " + newPassword + "\n\n" +
                 "You can sign in to the portal here:\n" +
                 (appUrl || "Your organization's PDMS portal URL") + "\n\n" +
                 "For security, please log in and update your password from your Profile page immediately.\n\n" +
                 "Best regards,\n" +
                 "PSE PDMS Security Team";
      MailApp.sendEmail(user.email, subject, body);
    } catch (e) {
      Logger.log("Failed to send reset email to " + user.email + ": " + e.toString());
    }

    return { email: user.email, name: user.name, sent: true };
  },

  notifyProfileUpdated: function (originalUser, updatedUser, plainPassword, editorName, appUrl) {
    if (!originalUser || !updatedUser) return;

    var fieldLabels = {
      name: 'Full Name',
      email: 'Work Email',
      role: 'Role',
      dept: 'Designation / Department',
      phone: 'Phone Number',
      birthday: 'Date of Birth',
      dateOfEntry: 'Date of Entry',
      status: 'Status',
      availability: 'Availability'
    };

    var changeLines = [];
    for (var key in fieldLabels) {
      var oldVal = originalUser[key] != null ? String(originalUser[key]).trim() : '';
      var newVal = updatedUser[key] != null ? String(updatedUser[key]).trim() : '';
      if (newVal !== oldVal) {
        if (oldVal && newVal) {
          changeLines.push("• " + fieldLabels[key] + ": " + newVal + " (previously: " + oldVal + ")");
        } else if (newVal) {
          changeLines.push("• " + fieldLabels[key] + ": " + newVal);
        } else if (oldVal) {
          changeLines.push("• " + fieldLabels[key] + ": [Cleared] (previously: " + oldVal + ")");
        }
      }
    }

    var targetEmail = updatedUser.email || originalUser.email;
    if (!targetEmail) return;

    // Check if anything actually changed
    if (changeLines.length === 0 && !plainPassword) return;

    var editor = editorName || 'HR Team';
    var userName = updatedUser.name || originalUser.name || 'User';
    var loginUrl = appUrl || "Your organization's PDMS portal URL";

    var subject = "";
    var body = "";

    if (plainPassword && changeLines.length === 0) {
      // 1. Password changed ONLY
      subject = "PSE PDMS - Your Account Password Has Been Updated";
      body = "Hello " + userName + ",\n\n" +
             "Your PSE PDMS account password has been updated by " + editor + ".\n\n" +
             "Here are your new login credentials:\n" +
             "• Email: " + targetEmail + "\n" +
             "• New Password: " + plainPassword + "\n\n" +
             "You can sign in to the portal here:\n" +
             loginUrl + "\n\n" +
             "For security, please log in and update your password from your Profile page as soon as possible.\n\n" +
             "If you did not request or expect this change, please contact the HR / People Operations team immediately.\n\n" +
             "Best regards,\n" +
             "PSE HR Team";
    } else if (plainPassword && changeLines.length > 0) {
      // 2. Both Profile Details AND Password changed
      subject = "PSE PDMS - Your Profile & Login Details Have Been Updated";
      body = "Hello " + userName + ",\n\n" +
             "Your profile details and password on the PSE PDMS portal have been updated by " + editor + ".\n\n" +
             "Here are your new login credentials:\n" +
             "• Email: " + targetEmail + "\n" +
             "• New Password: " + plainPassword + "\n\n" +
             "Summary of Profile Changes:\n" +
             changeLines.join("\n") + "\n\n" +
             "You can sign in to the portal and view your profile here:\n" +
             loginUrl + "\n\n" +
             "If you did not request or expect these changes, please contact the HR / People Operations team.\n\n" +
             "Best regards,\n" +
             "PSE HR Team";
    } else {
      // 3. Profile Details changed ONLY
      subject = "PSE PDMS - Your Profile Details Have Been Updated";
      body = "Hello " + userName + ",\n\n" +
             "Your profile details on the PSE PDMS portal have been updated by " + editor + ".\n\n" +
             "Here are the new changes:\n" +
             changeLines.join("\n") + "\n\n" +
             "You can sign in to the portal and view your profile here:\n" +
             loginUrl + "\n\n" +
             "If you did not request or expect these changes, please contact the HR / People Operations team.\n\n" +
             "Best regards,\n" +
             "PSE HR Team";
    }

    try {
      MailApp.sendEmail(targetEmail, subject, body);
    } catch (e) {
      Logger.log("Failed to send profile update email to " + targetEmail + ": " + e.toString());
    }
  }
};

