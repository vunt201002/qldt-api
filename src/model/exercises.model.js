import sequelize from '../database/connect.js';
import {baseModelField} from '../constant/baseModelField.js';
import {DataTypes} from 'sequelize';

const exercise = sequelize.define('exercise', {
  ...baseModelField,
  title: {
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
  classId: {
    type: DataTypes.UUIDV4,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  deadline: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.DATEONLY,
    allowNull: false,
  },
  students: {
    type: DataTypes.ARRAY,
    defaultValue: DataTypes.ARRAY(DataTypes.UUIDV4),
    allowNull: true,
  },
});

export default exercise;
