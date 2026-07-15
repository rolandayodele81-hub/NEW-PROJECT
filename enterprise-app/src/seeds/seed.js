import bcrypt from 'bcrypt';
import sequelize from '../config/database.js';
import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import Department from '../models/department.model.js';
import Client from '../models/client.model.js';
import Project from '../models/project.model.js';

const SALT_ROUNDS = 12;

const seed = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const [hrRole] = await Role.findOrCreate({ where: { name: 'HR' }, defaults: { description: 'Human Resources' } });
    const [adminRole] = await Role.findOrCreate({ where: { name: 'General Admin' }, defaults: { description: 'Platform administrator' } });

    await Department.findOrCreate({ where: { name: 'Human Resources' }, defaults: { description: 'HR department' } });
    await Department.findOrCreate({ where: { name: 'Technical Delivery' }, defaults: { description: 'HTD department' } });
    await Department.findOrCreate({ where: { name: 'Sales' }, defaults: { description: 'Sales department' } });

    const adminPassword = await bcrypt.hash('Admin@1234', SALT_ROUNDS);
    await User.findOrCreate({ where: { email: 'admin@pse.com' }, defaults: { name: 'System Administrator', email: 'admin@pse.com', password: adminPassword, role: 'General Admin', department: 'Operations' } });

    const hrPassword = await bcrypt.hash('Hr@1234', SALT_ROUNDS);
    await User.findOrCreate({ where: { email: 'hr@pse.com' }, defaults: { name: 'HR Manager', email: 'hr@pse.com', password: hrPassword, role: 'HR', department: 'Human Resources' } });

    await Client.findOrCreate({ where: { name: 'Panoramic Capital' }, defaults: { email: 'contact@panoramic.com', phone: '+1 555 124 7890', company: 'Panoramic Synergy' } });

    const sampleProject = await Project.findOrCreate({
      where: { project_id: 'PSE-001' },
      defaults: {
        project_id: 'PSE-001',
        name: 'Enterprise PM Platform',
        description: 'Modern project management system for Panoramic Synergy.',
        priority: 'Incoming',
        status: 'Incoming',
        budget: 150000,
        created_by_id: 1,
        assigned_by_id: 1,
        client_id: 1,
        department_id: 2,
        start_date: '2026-07-01',
        due_date: '2027-01-12',
        progress_percentage: 12,
      },
    });

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
