import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ProjectAssignment = sequelize.define('ProjectAssignment', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  user_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  role: { type: DataTypes.STRING(80), allowNull: false },
  assigned_by_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  assigned_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'ProjectAssignments',
});

export default ProjectAssignment;
