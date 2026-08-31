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
  }
};
