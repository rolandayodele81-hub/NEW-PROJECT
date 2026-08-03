import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import timeout from 'connect-timeout';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import projectRoutes from './routes/project.routes.js';
import reportRoutes from './routes/report.routes.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.middleware.js';
import logger from './logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true, credentials: true }));
app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(timeout('15s'));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  next();
});
app.use(morgan(isProd ? 'combined' : 'dev', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(apiLimiter);

app.get('/', (req, res) => res.json({ message: 'PSE Enterprise Project Management API' }));
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);

app.use((req, res, next) => {
  if (req.timedout) return;
  next();
});

app.use((err, req, res, next) => {
  if (req.timedout) return;
  logger.error('Unhandled error: %o', err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Database and models are synced.');
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
};

start();
