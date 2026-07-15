import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payment = sequelize.define('Payment', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  status: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'Pending' },
  note: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'Payments',
});

export default Payment;
