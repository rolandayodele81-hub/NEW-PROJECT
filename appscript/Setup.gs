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
      headers: ['id', 'name', 'email', 'passwordHash', 'role', 'dept', 'status', 'availability', 'workload', 'phone', 'joined', 'birthday'],
      textColumns: ['joined', 'birthday'],
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
      headers: ['id', 'name', 'industry', 'contact', 'email', 'phone', 'projects', 'revenue'],
      rows: []
    },
    Projects: {
      headers: ['id', 'name', 'client', 'type', 'dept', 'sales', 'pm', 'lead', 'consultants', 'priority', 'budget', 'status', 'stage', 'createdByRole', 'progress', 'start', 'due', 'completion', 'description', 'files', 'remarks'],
      textColumns: ['start', 'due', 'completion'],
      rows: []
    },
    Notifications: {
      headers: ['id', 'title', 'msg', 'icon', 'time', 'unread'],
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
    }
  };

  Object.keys(seed).forEach(function (sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    var isNew = !sheet;
    if (isNew) sheet = ss.insertSheet(sheetName);

    var def = seed[sheetName];
    if (isNew || sheet.getLastRow() <= 1) {
      sheet.getRange(1, 1, 1, def.headers.length).setValues([def.headers]);

      // Force date-like columns (e.g. "2026-01-15") to stay plain text —
      // otherwise Sheets silently converts them to Date cells and JSON.stringify
      // turns them into timestamps the frontend doesn't expect.
      (def.textColumns || []).forEach(function (colName) {
        var colIndex = def.headers.indexOf(colName) + 1;
        sheet.getRange(2, colIndex, sheet.getMaxRows() - 1, 1).setNumberFormat('@');
      });

      if (def.rows.length) {
        sheet.getRange(2, 1, def.rows.length, def.headers.length).setValues(def.rows);
      }
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
