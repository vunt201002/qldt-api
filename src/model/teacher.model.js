import sequelize from '../database/connect.js';
import {basePersonModelField} from '../constant/baseModelField.js';
import {DataTypes} from 'sequelize';

const teacher = sequelize.define('teacher', {
  ...basePersonModelField,
  students: {
    type: DataTypes.ARRAY,
    defaultValue: DataTypes.ARRAY,
    allowNull: false,
  },
});

export default teacher;
