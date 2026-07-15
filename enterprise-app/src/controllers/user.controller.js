import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import AuditLog from '../models/auditLog.model.js';

const SALT_ROUNDS = 12;

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id','name','email','role','department','is_active','createdAt','updatedAt'] });
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to load users.', error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;
    if (!name || !email || !password || !role) return res.status(400).json({ message: 'Missing required user fields.' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({ name, email: email.toLowerCase().trim(), password: hashed, role, department });

    await AuditLog.create({ user_id: req.user.id, action: 'Create user', entity: 'User', entity_id: String(user.id), details: `Created ${user.email}` });
    return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (err) {
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
    return res.status(500).json({ message: 'Unable to reset password.', error: err.message });
  }
};
