import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME || 'pse_pm', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    connectTimeout: 10000,
  },
  pool: {
    max: Number(process.env.DB_POOL_MAX || 15),
    min: Number(process.env.DB_POOL_MIN || 0),
    acquire: 30000,
    idle: 10000,
    evict: 10000,
  },
  retry: {
    max: 3,
  },
  define: {
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
});

export default sequelize;
