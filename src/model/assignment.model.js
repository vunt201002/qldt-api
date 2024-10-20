import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import statusAssignmentEnum from '../enumurator/statusAssignment.enum.js';

const Assignment = sequelize.define(
  'Assignment',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(statusAssignmentEnum)),
      defaultValue: statusAssignmentEnum.PENDING,
    },
    maxScore: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 100,
    },
  },
  {
    timestamps: true,
  },
);

export default Assignment;
