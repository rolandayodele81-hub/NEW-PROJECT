import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import bootstrapRoutes from './routes/bootstrap.routes.js';
import userRoutes from './routes/users.routes.js';
import projectRoutes from './routes/projects.routes.js';
import clientRoutes from './routes/clients.routes.js';
import departmentRoutes from './routes/departments.routes.js';
import consultantRoutes from './routes/consultants.routes.js';
import auditRoutes from './routes/audit.routes.js';
import notificationRoutes from './routes/notifications.routes.js';
import { verifyToken } from './middleware/auth.middleware.js';
import { initDb } from './db/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 4000;

app.use(helmet());
const allowedLocalOrigins = [
  /https?:\/\/localhost(:\d+)?$/,
  /https?:\/\/127\.0\.0\.1(:\d+)?$/
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (process.env.FRONTEND_ORIGIN && origin === process.env.FRONTEND_ORIGIN) return callback(null, true);
    if (allowedLocalOrigins.some(pattern => pattern.test(origin))) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..')));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/bootstrap', bootstrapRoutes);
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/projects', verifyToken, projectRoutes);
app.use('/api/clients', verifyToken, clientRoutes);
app.use('/api/departments', verifyToken, departmentRoutes);
app.use('/api/consultants', verifyToken, consultantRoutes);
app.use('/api/audit', verifyToken, auditRoutes);
app.use('/api/notifications', verifyToken, notificationRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

initDb().then(() => {
  app.listen(port, () => {
    console.log(`PSE PDMS backend running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
