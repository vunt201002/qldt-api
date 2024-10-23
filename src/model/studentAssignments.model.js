import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';

// Define the junction table model with custom columns
const StudentAssignments = sequelize.define(
  'StudentAssignments',
  {
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    submissionDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  },
);

export default StudentAssignments;
