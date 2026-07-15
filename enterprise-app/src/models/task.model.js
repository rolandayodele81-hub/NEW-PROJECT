import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Task = sequelize.define('Task', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  title: { type: DataTypes.STRING(180), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  assigned_to_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  status: { type: DataTypes.STRING(40), allowNull: false, defaultValue: 'Pending' },
  progress: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
  due_date: { type: DataTypes.DATEONLY, allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'Tasks',
  timestamps: false,
});

export default Task;
