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

    await Department.findOrCreate({ where: { name: 'Human Resources' }, defaults: { description: 'HR department' } });

    const hrPassword = await bcrypt.hash('HR@2026!', SALT_ROUNDS);
    await User.findOrCreate({ where: { email: 'hr@pse.com' }, defaults: { name: 'HR Manager', email: 'hr@pse.com', password: hrPassword, role: 'HR', department: 'Human Resources' } });

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
