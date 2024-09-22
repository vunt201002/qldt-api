import sequelize from '../database/connect.js';
import {baseModelField} from '../constant/baseModelField.js';
import {DataTypes} from 'sequelize';

const muster = sequelize.define('muster', {
  ...baseModelField,
  lessonId: {
    type: DataTypes.UUIDV4,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  classId: {
    type: DataTypes.UUIDV4,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  },
  students: {
    type: DataTypes.ARRAY(DataTypes.UUIDV4),
    defaultValue: DataTypes.ARRAY(DataTypes.UUIDV4),
    allowNull: true,
  },
});

export default muster;
