import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Client = sequelize.define('Client', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(140), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: true, validate: { isEmail: true } },
  phone: { type: DataTypes.STRING(40), allowNull: true },
  company: { type: DataTypes.STRING(200), allowNull: true },
  notes: { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'Clients',
});

export default Client;
