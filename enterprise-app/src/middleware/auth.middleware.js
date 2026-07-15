import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'PSE_SECRET_KEY';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Authentication required.' });

    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.id);
    if (!user || !user.is_active) return res.status(401).json({ message: 'Invalid credentials.' });

    req.user = { id: user.id, role: user.role, email: user.email, name: user.name };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized.', error: error.message });
  }
};

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized.' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient privileges.' });
    }
    next();
  };
};
