import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER.UNSIGNED, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(160), allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING(200), allowNull: false },
  role: { type: DataTypes.ENUM('General Admin','HR','HTD','COO','Lead Project Manager','Project Manager','Sales','Consultant','Viewer'), allowNull: false },
  department: { type: DataTypes.STRING(80), allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  last_login: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'Users',
});

export default User;
