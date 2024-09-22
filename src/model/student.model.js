import sequelize from '../database/connect.js';
import {basePersonModelField} from '../constant/baseModelField.js';
import {DataTypes} from 'sequelize';

const student = sequelize.define('student', {
  ...basePersonModelField,
  statusMuster: {
    type: DataTypes.ARRAY(DataTypes.UUIDV4),
    defaultValue: DataTypes.ARRAY(DataTypes.UUIDV4),
    allowNull: false,
  },
});

export default student;
