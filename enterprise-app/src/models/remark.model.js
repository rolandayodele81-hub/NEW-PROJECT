import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Remark = sequelize.define('Remark', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  role: { type: DataTypes.STRING(80), allowNull: false },
  project_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'Remarks',
  timestamps: false,
});

export default Remark;
