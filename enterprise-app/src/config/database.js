import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME || 'pse_pm', process.env.DB_USER || 'root', process.env.DB_PASS || '', {
  host: process.env.DB_HOST || '127.0.0.1',
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
    freezeTableName: true,
  },
});

export default sequelize;
