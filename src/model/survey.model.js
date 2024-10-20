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
      // Structure: [{ question: string, type: 'multiple_choice' | 'text' | 'rating', options?: string[] }]
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
  },
);

export default Survey;
