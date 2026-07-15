import { query, initDb } from './db.js';

async function migrate() {
  await initDb();

  const tables = [
    `CREATE TABLE IF NOT EXISTS roles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT
    );`,

    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      department TEXT,
      status TEXT NOT NULL DEFAULT 'Active',
      phone TEXT DEFAULT '',
      availability TEXT DEFAULT 'Available',
      workload INTEGER DEFAULT 0,
      specialty TEXT DEFAULT '',
      rate REAL DEFAULT 0,
      projects INTEGER DEFAULT 0,
      rating TEXT DEFAULT '',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      industry TEXT,
      contact TEXT,
      email TEXT,
      phone TEXT,
      projects INTEGER DEFAULT 0,
      revenue REAL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS departments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      manager TEXT,
      count INTEGER DEFAULT 0,
      color TEXT DEFAULT 'primary',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      client_id INTEGER,
      description TEXT,
      department_id INTEGER,
      type TEXT,
      priority TEXT NOT NULL DEFAULT 'Medium',
      status TEXT NOT NULL DEFAULT 'Incoming',
      budget REAL DEFAULT 0,
      project_manager INTEGER,
      project_lead INTEGER,
      sales TEXT,
      consultants TEXT,
      files INTEGER DEFAULT 0,
      remarks INTEGER DEFAULT 0,
      created_by INTEGER,
      assigned_by INTEGER,
      start_date TEXT,
      due_date TEXT,
      completion_date TEXT,
      progress INTEGER DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
      FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
      FOREIGN KEY (project_manager) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (project_lead) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
    );`,

    `CREATE TABLE IF NOT EXISTS project_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT,
      assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS remarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL,
      remark TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );`,

    `CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT,
      read_flag INTEGER DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );`,

    `CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      role TEXT,
      action TEXT NOT NULL,
      subject TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );`,

    `CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      assignee INTEGER,
      status TEXT NOT NULL DEFAULT 'Pending',
      progress INTEGER DEFAULT 0,
      due_date TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (assignee) REFERENCES users(id) ON DELETE SET NULL
    );`,

    `CREATE TABLE IF NOT EXISTS milestones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      due_date TEXT,
      status TEXT NOT NULL DEFAULT 'Pending',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS deliverables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      user_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'Draft',
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );`
  ];

  for (const sql of tables) {
    await query(sql);
  }

  const seedRoles = [
    ['General Admin', 'Full administrative access'],
    ['HR', 'Human resources and employee management'],
    ['HTD', 'Head of delivery and project assignment'],
    ['COO', 'Chief operating officer'],
    ['Lead Project Manager', 'Lead delivery managers'],
    ['Project Manager', 'Project execution owners'],
    ['Sales', 'Sales and client intake'],
    ['Consultant', 'Delivery consultants'],
    ['Viewer', 'Read-only access']
  ];

  const existingRoles = await query('SELECT COUNT(*) AS count FROM roles');
  if (existingRoles[0].count === 0) {
    for (const [name, description] of seedRoles) {
      await query('INSERT INTO roles (name, description) VALUES (?, ?)', [name, description]);
    }
  }

  const usersCount = await query('SELECT COUNT(*) AS count FROM users');
  if (usersCount[0].count === 0) {
    const hashed = '$2b$12$wZ3dOqEjyIwA1kO0d0TmR.z6A5RhVtMvVufN7rSQaZzd52pQmG5Fa';
    const users = [
      ['Admin User', 'admin@pse.com', hashed, 'General Admin', 'Executive', 'Active', '', 'Available', 0, '', 0, 0, ''],
      ['HR Lead', 'hr@pse.com', hashed, 'HR', 'Human Resources', 'Active', '', 'Available', 0, '', 0, 0, ''],
      ['COO Leader', 'coo@pse.com', hashed, 'COO', 'Executive', 'Active', '', 'Available', 0, '', 0, 0, ''],
      ['Sales Head', 'sales@pse.com', hashed, 'Sales', 'Sales', 'Active', '', 'Available', 0, '', 0, 0, ''],
      ['Delivery Lead', 'leadpm@pse.com', hashed, 'Lead Project Manager', 'Operations', 'Active', '', 'Available', 0, '', 0, 0, ''],
      ['Project Manager', 'pm@pse.com', hashed, 'Project Manager', 'Operations', 'Active', '', 'Available', 0, '', 0, 0, ''],
      ['Consultant User', 'consultant@pse.com', hashed, 'Consultant', 'Engineering', 'Active', '', 'Available', 0, '', 0, 0, '']
    ];

    for (const user of users) {
      await query(
        'INSERT INTO users (name, email, password, role, department, status, phone, availability, workload, specialty, rate, projects, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        user
      );
    }
  }

  console.log('Migration completed.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
