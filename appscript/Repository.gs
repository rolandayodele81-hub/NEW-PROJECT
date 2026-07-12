/**
 * Generic CRUD engine, shared by every entity in ENTITIES.
 * Rows are mapped to/from plain objects using the sheet's header row —
 * no entity-specific read/write code needed anywhere in this file.
 */

function getSheet_(name) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error('Sheet not found: ' + name + ' (run Setup.initializeSheets first)');
  return sheet;
}

function readTable_(sheetName) {
  var sheet = getSheet_(sheetName);
  var values = sheet.getDataRange().getValues();
  var headers = values.shift() || [];
  return { sheet: sheet, headers: headers, rows: values };
}

function rowToObject_(headers, row, jsonFields) {
  var obj = {};
  headers.forEach(function (key, i) {
    if (!key) return;
    var value = row[i];
    if (jsonFields && jsonFields.indexOf(key) !== -1 && typeof value === 'string' && value) {
      try { value = JSON.parse(value); } catch (e) { /* leave as raw string */ }
    }
    obj[key] = value;
  });
  return obj;
}

function objectToRow_(headers, obj, jsonFields) {
  return headers.map(function (key) {
    var value = obj[key];
    if (value === undefined || value === null) return '';
    if (jsonFields && jsonFields.indexOf(key) !== -1 && typeof value === 'object') {
      return JSON.stringify(value);
    }
    return value;
  });
}

function stripExcluded_(obj, excludeFields) {
  if (!excludeFields || !excludeFields.length) return obj;
  var copy = Object.assign({}, obj);
  excludeFields.forEach(function (f) { delete copy[f]; });
  return copy;
}

function generateId_(prefix) {
  return (prefix || '') + Math.floor(1000 + Math.random() * 8999);
}

// Sheets silently converts date-shaped strings ("2026-01-15") to Date cells
// on write, ignoring any number format applied ahead of time — so force
// plain-text formatting on the exact target cells right before every write.
function forceTextFormat_(sheet, headers, textFields, rowIndex) {
  if (!textFields || !textFields.length) return;
  textFields.forEach(function (colName) {
    var colIndex = headers.indexOf(colName) + 1;
    if (colIndex > 0) sheet.getRange(rowIndex, colIndex).setNumberFormat('@');
  });
}

var Repository = {
  list: function (entityKey) {
    var cfg = entityConfig_(entityKey);
    var table = readTable_(cfg.sheet);
    return table.rows.map(function (row) {
      return rowToObject_(table.headers, row, cfg.jsonFields);
    });
  },

  find: function (entityKey, id) {
    var match = this.list(entityKey).filter(function (r) { return String(r.id) === String(id); });
    return match.length ? match[0] : null;
  },

  insert: function (entityKey, record) {
    var cfg = entityConfig_(entityKey);
    var table = readTable_(cfg.sheet);
    var withId = Object.assign({}, record);
    if (!withId.id) withId.id = generateId_(cfg.idPrefix);
    var row = objectToRow_(table.headers, withId, cfg.jsonFields);
    var rowIndex = table.sheet.getLastRow() + 1;
    forceTextFormat_(table.sheet, table.headers, cfg.textFields, rowIndex);
    table.sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    return withId;
  },

  update: function (entityKey, id, patch) {
    var cfg = entityConfig_(entityKey);
    var table = readTable_(cfg.sheet);
    var idIndex = table.headers.indexOf('id');
    for (var i = 0; i < table.rows.length; i++) {
      if (String(table.rows[i][idIndex]) === String(id)) {
        var current = rowToObject_(table.headers, table.rows[i], cfg.jsonFields);
        var merged = Object.assign({}, current, patch, { id: current.id });
        var row = objectToRow_(table.headers, merged, cfg.jsonFields);
        var rowIndex = i + 2;
        forceTextFormat_(table.sheet, table.headers, cfg.textFields, rowIndex);
        table.sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
        return merged;
      }
    }
    throw new Error('Record not found: ' + entityKey + '/' + id);
  },

  remove: function (entityKey, id) {
    var cfg = entityConfig_(entityKey);
    var table = readTable_(cfg.sheet);
    var idIndex = table.headers.indexOf('id');
    for (var i = 0; i < table.rows.length; i++) {
      if (String(table.rows[i][idIndex]) === String(id)) {
        table.sheet.deleteRow(i + 2);
        return { id: id };
      }
    }
    throw new Error('Record not found: ' + entityKey + '/' + id);
  }
};
