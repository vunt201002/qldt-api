import sequelize from '../database/connect.js';
import {baseModelField} from '../constant/baseModelField.js';
import {DataTypes} from 'sequelize';

const classModel = sequelize.define('class', {
  ...baseModelField,
  name: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    defaultValue: DataTypes.STRING,
    allowNull: true,
  },
  teacher: {
    type: DataTypes.UUIDV4,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  students: {
    type: DataTypes.ARRAY(DataTypes.UUIDV4),
    defaultValue: DataTypes.ARRAY(DataTypes.UUIDV4),
    allowNull: false,
  },
});

export default classModel;
