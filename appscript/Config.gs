/**
 * Registry of every data collection backing the PSE PDMS app.
 * Add a new collection by adding one entry here — Repository.gs needs no changes.
 *
 * sheet:          tab name in the bound Spreadsheet
 * idPrefix:       prefix used when Repository generates a new id
 * jsonFields:     row cells that hold JSON (arrays/objects) instead of scalars
 * textFields:     date-like columns ("2026-01-15") that must stay plain text —
 *                  Repository re-applies '@' formatting on every write to these,
 *                  since Sheets silently converts date-shaped strings to Date
 *                  cells otherwise (number-format alone doesn't stick for appendRow).
 * publicExclude:  fields stripped before data is sent to the client bootstrap payload
 */
var ENTITIES = {
  departments: { sheet: 'Departments', idPrefix: 'D' },
  users: { sheet: 'Users', idPrefix: 'U', publicExclude: ['passwordHash'], textFields: ['joined', 'birthday'] },
  consultants: { sheet: 'Consultants', idPrefix: 'C', textFields: ['joined'] },
  clients: { sheet: 'Clients', idPrefix: 'CL' },
  projects: { sheet: 'Projects', idPrefix: 'PSE-', jsonFields: ['consultants'], textFields: ['start', 'due', 'completion'] },
  notifications: { sheet: 'Notifications', idPrefix: 'N' },
  threads: { sheet: 'Threads', idPrefix: 'T', jsonFields: ['user', 'messages'] },
  activities: { sheet: 'Activities', idPrefix: 'A' },
  reviews: { sheet: 'Reviews', idPrefix: 'RV', jsonFields: ['comments'] }
};

function entityConfig_(entityKey) {
  var cfg = ENTITIES[entityKey];
  if (!cfg) throw new Error('Unknown entity: ' + entityKey);
  return cfg;
}
