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
      case 'create':
        return jsonOutput_({ ok: true, data: Repository.insert(body.resource, body.record) });
      case 'update':
        return jsonOutput_({ ok: true, data: Repository.update(body.resource, body.id, body.patch) });
      case 'remove':
        return jsonOutput_({ ok: true, data: Repository.remove(body.resource, body.id) });
      case 'login': {
        var user = Auth.login(body.email, body.password, body.adminId);
        return user
          ? jsonOutput_({ ok: true, data: user })
          : jsonOutput_({ ok: false, error: 'Invalid login credentials' });
      }
      case 'register':
        return jsonOutput_({ ok: true, data: Auth.register(body.account) });
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
  var data = {};
  Object.keys(ENTITIES).forEach(function (key) {
    var cfg = ENTITIES[key];
    data[key] = Repository.list(key).map(function (r) { return stripExcluded_(r, cfg.publicExclude); });
  });
  return data;
}
