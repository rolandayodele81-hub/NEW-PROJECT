-- PSE PDMS initial schema and seed data

CREATE DATABASE IF NOT EXISTS pse_pdms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pse_pdms;

CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(64) NOT NULL,
  department VARCHAR(128),
  status ENUM('Active','Suspended','On Leave','Disabled') NOT NULL DEFAULT 'Active',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  industry VARCHAR(120),
  email VARCHAR(180),
  phone VARCHAR(64),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(180) NOT NULL UNIQUE,
  manager VARCHAR(128),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_code VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  client_id INT,
  description TEXT,
  department_id INT,
  priority ENUM('Critical','High','Medium','Low') NOT NULL DEFAULT 'Medium',
  status ENUM('Incoming','Pending','Assigned','In Progress','Waiting Client','Review','Testing','Completed','Delivered','Closed','Cancelled') NOT NULL DEFAULT 'Incoming',
  budget DECIMAL(14,2) DEFAULT 0,
  project_manager INT,
  project_lead INT,
  created_by INT,
  assigned_by INT,
  start_date DATE,
  due_date DATE,
  completion_date DATE,
  progress INT DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (project_manager) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (project_lead) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(64),
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS remarks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(64) NOT NULL,
  remark TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(64),
  read_flag TINYINT(1) DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  role VARCHAR(64),
  action VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  assignee INT,
  status ENUM('Pending','In Progress','Completed','Blocked') NOT NULL DEFAULT 'Pending',
  progress INT DEFAULT 0,
  due_date DATE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS milestones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  due_date DATE,
  status ENUM('Pending','In Progress','Completed','Approved') NOT NULL DEFAULT 'Pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS deliverables (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('Draft','Submitted','Approved','Rejected') NOT NULL DEFAULT 'Draft',
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO roles (name, description) VALUES
('General Admin', 'Full administrative access'),
('HR', 'Human resources and employee management'),
('HTD', 'Head of delivery and project assignment'),
('COO', 'Chief operating officer'),
('Lead Project Manager', 'Lead delivery managers'),
('Project Manager', 'Project execution owners'),
('Sales', 'Sales and client intake'),
('Consultant', 'Delivery consultants'),
('Viewer', 'Read-only access');

INSERT INTO users (name, email, password, role, department, status) VALUES
('Admin User', 'admin@pse.com', '$2b$12$wZ3dOqEjyIwA1kO0d0TmR.z6A5RhVtMvVufN7rSQaZzd52pQmG5Fa', 'General Admin', 'Executive', 'Active'),
('HR Lead', 'hr@pse.com', '$2b$12$wZ3dOqEjyIwA1kO0d0TmR.z6A5RhVtMvVufN7rSQaZzd52pQmG5Fa', 'HR', 'Human Resources', 'Active'),
('COO Leader', 'coo@pse.com', '$2b$12$wZ3dOqEjyIwA1kO0d0TmR.z6A5RhVtMvVufN7rSQaZzd52pQmG5Fa', 'COO', 'Executive', 'Active'),
('Sales Head', 'sales@pse.com', '$2b$12$wZ3dOqEjyIwA1kO0d0TmR.z6A5RhVtMvVufN7rSQaZzd52pQmG5Fa', 'Sales', 'Sales', 'Active'),
('Delivery Lead', 'leadpm@pse.com', '$2b$12$wZ3dOqEjyIwA1kO0d0TmR.z6A5RhVtMvVufN7rSQaZzd52pQmG5Fa', 'Lead Project Manager', 'Operations', 'Active'),
('Project Manager', 'pm@pse.com', '$2b$12$wZ3dOqEjyIwA1kO0d0TmR.z6A5RhVtMvVufN7rSQaZzd52pQmG5Fa', 'Project Manager', 'Operations', 'Active'),
('Consultant User', 'consultant@pse.com', '$2b$12$wZ3dOqEjyIwA1kO0d0TmR.z6A5RhVtMvVufN7rSQaZzd52pQmG5Fa', 'Consultant', 'Engineering', 'Active');
