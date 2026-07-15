import bcrypt from 'bcrypt';
import { signToken } from '../middleware/auth.middleware.js';
import { findUserByEmail, createUser } from '../models/user.model.js';
import { logEvent } from '../models/audit.model.js';

const SALT_ROUNDS = 12;

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = await findUserByEmail(email.toLowerCase());
  if (!user || user.status !== 'Active') return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  await logEvent({ user_id: user.id, role: user.role, action: 'Login', subject: 'User authentication', ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.json({ data: { token, user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department } } });
}

export async function register(req, res) {
  const { name, email, password, role, department } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Name, email, password and role are required' });

  const existing = await findUserByEmail(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({ name, email: email.toLowerCase(), password: hashed, role, department });
  await logEvent({ user_id: user.id, role: user.role, action: 'User registration', subject: `Created user ${user.email}`, ip_address: req.ip, user_agent: req.headers['user-agent'] });

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  res.status(201).json({ data: { token, user } });
}
