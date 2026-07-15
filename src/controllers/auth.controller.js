import bcrypt from 'bcrypt';
import { signToken } from '../middleware/auth.middleware.js';
import { findUserByEmail, findUserById, createUser } from '../models/user.model.js';
import { logEvent } from '../models/audit.model.js';

const SALT_ROUNDS = 12;

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const user = await findUserByEmail(email.toLowerCase());
  if (!user || user.status !== 'Active') return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const normalizedUser = await findUserById(user.id);
  const token = signToken({ id: normalizedUser.id, role: normalizedUser.role, email: normalizedUser.email });
  await logEvent({ user_id: normalizedUser.id, role: normalizedUser.role, action: 'Login', subject: 'User authentication', ip_address: req.ip, user_agent: req.headers['user-agent'] });
  res.json({ data: { token, user: normalizedUser } });
}

export async function register(req, res) {
  const { name, email, password, role } = req.body;
  const department = req.body.department || req.body.dept || null;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Name, email, password and role are required' });

  const existing = await findUserByEmail(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await createUser({
    name,
    email: email.toLowerCase(),
    password: hashed,
    role,
    department,
    phone: req.body.phone,
    availability: req.body.availability,
    workload: req.body.workload,
    specialty: req.body.specialty,
    rate: req.body.rate,
    projects: req.body.projects,
    rating: req.body.rating,
    status: req.body.status || 'Active'
  });
  await logEvent({ user_id: user.id, role: user.role, action: 'User registration', subject: `Created user ${user.email}`, ip_address: req.ip, user_agent: req.headers['user-agent'] });

  const token = signToken({ id: user.id, role: user.role, email: user.email });
  res.status(201).json({ data: { token, user } });
}
