import sequelize from '../database/connect.js';
import {basePersonModelField} from '../constant/baseModelField.js';
import {DataTypes} from 'sequelize';

const student = sequelize.define('student', {
  ...basePersonModelField,
  statusMuster: {
    type: DataTypes.ARRAY,
    defaultValue: DataTypes.ARRAY,
    allowNull: false,
  },
});

export default student;
