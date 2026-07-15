import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  action: { type: DataTypes.STRING(140), allowNull: false },
  entity: { type: DataTypes.STRING(80), allowNull: true },
  entity_id: { type: DataTypes.STRING(80), allowNull: true },
  details: { type: DataTypes.TEXT, allowNull: true },
  ip_address: { type: DataTypes.STRING(45), allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'AuditLogs',
  timestamps: false,
});

export default AuditLog;
