import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

let db;

function openSqlite(file) {
  return new Promise((resolve, reject) => {
    const dbFile = path.resolve(file);
    const sqlite = sqlite3.verbose();
    const instance = new sqlite.Database(dbFile, err => {
      if (err) return reject(err);
      instance.run('PRAGMA foreign_keys = ON', pragmaErr => {
        if (pragmaErr) return reject(pragmaErr);
        resolve(instance);
      });
    });
  });
}

export async function query(sql, params = []) {
  if (!db) await initDb();
  const trimmed = sql.trim().toUpperCase();
  return new Promise((resolve, reject) => {
    if (trimmed.startsWith('SELECT') || trimmed.startsWith('PRAGMA')) {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    } else {
      db.run(sql, params, function (err) {
        if (err) return reject(err);
        resolve({ lastID: this.lastID, changes: this.changes });
      });
    }
  });
}

export async function initDb() {
  if (db) return db;
  const file = process.env.DB_FILE || path.join(process.cwd(), 'src', 'db', 'pse_pdms.sqlite');
  console.log('Initializing SQLite database:', file);
  db = await openSqlite(file);
  return db;
}
