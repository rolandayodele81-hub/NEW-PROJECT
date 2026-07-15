import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import AuditLog from '../models/auditLog.model.js';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'PSE_SECRET_KEY';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '2h';

export const login = async (req, res) => {
  try {
    const { email, password, remember } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user || !user.is_active) return res.status(401).json({ message: 'Invalid credentials.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, {
      expiresIn: remember ? '7d' : JWT_EXPIRES,
    });

    await user.update({ last_login: new Date() });
    await AuditLog.create({ user_id: user.id, action: 'User login', entity: 'User', entity_id: String(user.id), details: 'Login successful', ip_address: req.ip });

    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Authentication failed.', error: err.message });
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: ['id', 'name', 'email', 'role', 'department', 'is_active', 'last_login'] });
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to load user.', error: err.message });
  }
};
