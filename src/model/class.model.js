import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';

const Class = sequelize.define(
  'Class',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    schedule: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    semester: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    maxStudent: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    validate: {
      startDateBeforeEndDate() {
        if (this.startDate >= this.endDate) {
          throw new Error('The start date must be before the end date.');
        }
      },
    },
  },
);

export default Class;
