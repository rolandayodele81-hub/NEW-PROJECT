import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Milestone = sequelize.define('Milestone', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  title: { type: DataTypes.STRING(180), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  due_date: { type: DataTypes.DATEONLY, allowNull: true },
  status: { type: DataTypes.STRING(60), allowNull: false, defaultValue: 'Planned' },
  completed_at: { type: DataTypes.DATE, allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'Milestones',
  timestamps: false,
});

export default Milestone;
