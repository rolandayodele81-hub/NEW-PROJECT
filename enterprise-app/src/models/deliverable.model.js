import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Deliverable = sequelize.define('Deliverable', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  project_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
  title: { type: DataTypes.STRING(180), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  uploaded_by_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
  file_url: { type: DataTypes.STRING(250), allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
}, {
  tableName: 'Deliverables',
  timestamps: false,
});

export default Deliverable;
