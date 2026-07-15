import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.model.js';
import Client from './client.model.js';
import Department from './department.model.js';

const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.STRING(64), allowNull: false, unique: true },
  name: { type: DataTypes.STRING(180), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  department_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  priority: { type: DataTypes.ENUM('Incoming','Pending','Assigned','In Progress','Waiting Client','Review','Testing','Completed','Delivered','Closed','Cancelled'), allowNull: false, defaultValue: 'Incoming' },
  status: { type: DataTypes.ENUM('Incoming','Pending','Assigned','In Progress','Waiting Client','Review','Testing','Completed','Delivered','Closed','Cancelled'), allowNull: false, defaultValue: 'Incoming' },
  budget: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
  project_manager_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  project_lead_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  client_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  created_by_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  assigned_by_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  start_date: { type: DataTypes.DATEONLY, allowNull: true },
  due_date: { type: DataTypes.DATEONLY, allowNull: true },
  completion_date: { type: DataTypes.DATEONLY, allowNull: true },
  remarks: { type: DataTypes.TEXT, allowNull: true },
  attachments: { type: DataTypes.JSON, allowNull: true },
  progress_percentage: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
}, {
  tableName: 'Projects',
});

Project.belongsTo(User, { as: 'createdBy', foreignKey: 'created_by_id' });
Project.belongsTo(User, { as: 'assignedBy', foreignKey: 'assigned_by_id' });
Project.belongsTo(User, { as: 'projectManager', foreignKey: 'project_manager_id' });
Project.belongsTo(User, { as: 'projectLead', foreignKey: 'project_lead_id' });
Project.belongsTo(Client, { as: 'client', foreignKey: 'client_id' });
Project.belongsTo(Department, { as: 'department', foreignKey: 'department_id' });

export default Project;
