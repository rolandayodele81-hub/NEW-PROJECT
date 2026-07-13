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
      rows: [
        ['D01', 'Human Resources', 'Alice Park', 12, 'primary'],
        ['D02', 'Engineering', 'Marcus Lee', 28, 'success'],
        ['D03', 'Sales', 'Naomi Chen', 9, 'info']
      ]
    },
    Users: {
      headers: ['id', 'name', 'email', 'passwordHash', 'role', 'dept', 'status', 'availability', 'workload', 'phone', 'joined'],
      textColumns: ['joined'],
      rows: [
        ['U001', 'General Admin', 'admin@pse.com', hashPassword_('admin123'), 'General Admin', 'Executive', 'Active', 'Available', 10, '+1234567890', '2026-01-15']
      ]
    },
    Consultants: {
      headers: ['id', 'name', 'email', 'role', 'dept', 'status', 'availability', 'workload', 'phone', 'joined', 'specialty', 'rate', 'projects', 'rating'],
      textColumns: ['joined'],
      rows: [
        ['C001', 'Mark Smith', 'mark@company.com', 'Consultant', 'Engineering', 'Active', 'Available', 32, '+1234567890', '2026-03-12', 'Cloud Architect', 150, 3, '4.8']
      ]
    },
    Clients: {
      headers: ['id', 'name', 'industry', 'contact', 'email', 'phone', 'projects', 'revenue'],
      rows: [
        ['CL001', 'Acme Corp', 'Banking', 'Jane Doe', 'contact@acme.com', '+1234567890', 5, 250000]
      ]
    },
    Projects: {
      headers: ['id', 'name', 'client', 'type', 'dept', 'sales', 'pm', 'lead', 'consultants', 'priority', 'budget', 'status', 'progress', 'start', 'due', 'completion', 'description', 'files', 'remarks'],
      textColumns: ['start', 'due', 'completion'],
      rows: [
        ['PSE-1001', 'Alpha Platform', 'Acme Corp', 'Software Development', 'Engineering', 'Alice Johnson', 'John Smith', 'Emily Clark', JSON.stringify(['Mark Smith']), 'High', 350000, 'In Progress', 45, '2026-04-01', '2026-09-01', '', 'Project description goes here.', 4, 2]
      ]
    },
    Notifications: {
      headers: ['id', 'title', 'msg', 'icon', 'time', 'unread'],
      rows: [
        ['N001', 'New project request', 'A client has submitted a new project intake.', 'activity', '2h ago', true]
      ]
    },
    Threads: {
      headers: ['id', 'user', 'messages', 'unread', 'last'],
      rows: [
        ['T001', JSON.stringify({ name: 'Jane Doe' }), JSON.stringify([{ from: 'me', text: 'Can you share the latest update?', time: '1h ago' }]), 1, 'Can you share the latest update?']
      ]
    },
    Activities: {
      headers: ['id', 'user', 'role', 'action', 'target', 'time'],
      rows: [
        ['A001', 'General Admin', 'General Admin', 'created', 'Alpha Platform', '2h ago']
      ]
    }
  };

  Object.keys(seed).forEach(function (sheetName) {
    var sheet = ss.getSheetByName(sheetName);
    var isNew = !sheet;
    if (isNew) sheet = ss.insertSheet(sheetName);

    var def = seed[sheetName];
    if (isNew || sheet.getLastRow() === 0) {
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
