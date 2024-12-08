import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import statusSurveyEnum from '../enumurator/statusSurvey.enum.js';

const Survey = sequelize.define(
  'Survey',
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
    questions: {
      type: DataTypes.JSON,
      allowNull: false,
      // Structure: [{ question: String, type: 'multiple_choice' | 'text' | 'rating', options?: String[] }]
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(statusSurveyEnum)),
      defaultValue: statusSurveyEnum.DRAFT,
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

export default Survey;
