import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';

const Student = sequelize.define(
  'Student',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    schedule: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default Student;