# PSE PDMS — Apps Script + Sheets backend

Replaces the old localStorage-only data layer. Google Sheet is the database;
Apps Script exposes it as a small JSON API and (for reads) as an executable
`<script>` payload so the existing static pages don't need to become async.

## How it's structured

- `Config.gs` — the entity registry (sheet name, id prefix, JSON columns, fields to hide from clients). Add a new collection by adding one entry here.
- `Repository.gs` — generic CRUD (`list`, `find`, `insert`, `update`, `remove`) shared by every entity. No entity-specific code.
- `Auth.gs` — login/register, kept separate from the CRUD layer. Passwords are hashed (SHA-256 + a per-project salt stored in Script Properties) — the client never receives a hash.
- `Api.gs` — `doGet`/`doPost` router. Every response is `{ok, data}` or `{ok:false, error}`.
- `Setup.gs` — one-time script that creates the sheet tabs, headers, and seed rows.

## Deploy it

1. Go to [script.google.com](https://script.google.com), create a new project (or run `clasp create` if you use clasp).
2. Copy each `.gs` file in this folder into the Apps Script editor, and set the manifest (`appsscript.json`, enable "Show manifest file" under Project Settings) to match the one here.
3. Create a new Google Sheet (or open an existing one) and bind this script to it: Extensions → Apps Script, from the sheet itself — or use `File → See all projects` if using a standalone script and set the Spreadsheet as the container.
4. In the Apps Script editor, select `initializeSheets` from the function dropdown and click **Run** once. Grant the permissions it asks for. This creates all 8 tabs with headers and seed rows, and generates a random password salt (stored in Script Properties, never in code).
5. Deploy → New deployment → type **Web app**. Execute as **Me**, access **Anyone** (matches the current no-login-required setup of the app). Copy the `/exec` URL.
6. Paste that URL into `PDMS_API_URL` in [`js/config.js`](../js/config.js) in the frontend.

Redeploying later (Deploy → Manage deployments → Edit → new version) keeps the same URL, so you won't need to update `js/config.js` again after the first time.

## Notes / trade-offs

- Every write takes a script lock, so concurrent edits are serialized rather than racing — fine for an internal tool, not built for high write throughput.
- The default admin seeded by `initializeSheets` is `admin@pse.com` / `admin123` with Admin ID `ADM-1234` — change the password via the Users sheet (or re-run registration) before real use.
- If you add a field that holds a date-like string (`YYYY-MM-DD`), add it to that entity's `textColumns` in `Setup.gs`, or Sheets may silently convert it to a real Date cell and break the JSON your frontend expects.
