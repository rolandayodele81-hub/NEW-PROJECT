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
  login: function (email, password, adminId) {
    var user = findUserByEmail_(email);
    if (!user || user.passwordHash !== hashPassword_(password)) return null;
    if (user.role === 'General Admin') {
      if (!adminId || String(user.adminId || '').trim() !== String(adminId).trim()) return null;
    }
    return stripExcluded_(user, ['passwordHash']);
  },

  register: function (account) {
    if (findUserByEmail_(account.email)) {
      throw new Error('An account with that email already exists');
    }
    var record = Object.assign({}, account);
    record.passwordHash = hashPassword_(record.password);
    delete record.password;
    record.status = record.status || 'Active';
    record.availability = record.availability || 'Available';
    record.workload = record.workload || 0;
    record.joined = record.joined || new Date().toISOString().slice(0, 10);
    if (record.role === 'General Admin' && !record.adminId) {
      record.adminId = 'ADM-' + Math.floor(1000 + Math.random() * 9000);
    }
    var saved = Repository.insert('users', record);
    return stripExcluded_(saved, ['passwordHash']);
  }
};
