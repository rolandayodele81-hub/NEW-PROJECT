import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import AuditLog from '../models/auditLog.model.js';
import logger from '../logger.js';

const SALT_ROUNDS = 12;
function isValidEmail(email){ return String(email||'').trim().toLowerCase().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/); }

export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const offset = (page - 1) * limit;
    const { rows: users, count } = await User.findAndCountAll({
      attributes: ['id','name','email','role','department','is_active','createdAt','updatedAt'],
      order: [['updatedAt','DESC']],
      limit,
      offset,
    });
    return res.json({ users, meta: { page, limit, total: count } });
  } catch (err) {
    logger.error('Unable to load users: %o', err);
    return res.status(500).json({ message: 'Unable to load users.', error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing required user fields.' });
    if (!isValidEmail(email)) return res.status(400).json({ message: 'Invalid email format.' });
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await User.findOne({ where: { email: normalizedEmail } });
    if (existing) return res.status(409).json({ message: 'A user with that email already exists.' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email: normalizedEmail, password: hashed, role, department });

    await AuditLog.create({ user_id: req.user.id, action: 'Create user', entity: 'User', entity_id: String(user.id), details: `Created ${user.email}` });
    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (err) {
    logger.error('Could not create user: %o', err);
    return res.status(500).json({ message: 'Could not create user.', error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, department, is_active } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    await user.update({ name, role, department, is_active });
    await AuditLog.create({ user_id: req.user.id, action: 'Update user', entity: 'User', entity_id: id, details: `Updated ${user.email}` });
    return res.json({ user });
  } catch (err) {
    logger.error('Unable to update user: %o', err);
    return res.status(500).json({ message: 'Unable to update user.', error: err.message });
  }
};

export const disableUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    await user.update({ is_active: false });
    await AuditLog.create({ user_id: req.user.id, action: 'Disable user', entity: 'User', entity_id: id, details: `Disabled ${user.email}` });
    return res.json({ message: 'User disabled.' });
  } catch (err) {
    logger.error('Unable to disable user: %o', err);
    return res.status(500).json({ message: 'Unable to disable user.', error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required.' });

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    await user.update({ password: hashed });
    await AuditLog.create({ user_id: req.user.id, action: 'Reset password', entity: 'User', entity_id: id, details: `Password reset for ${user.email}` });
    return res.json({ message: 'Password reset successfully.' });
  } catch (err) {
    logger.error('Unable to reset password: %o', err);
    return res.status(500).json({ message: 'Unable to reset password.', error: err.message });
  }
};
