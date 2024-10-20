import sequelize from '../database/connect.js';
import {DataTypes} from 'sequelize';
import AccountModel from './account.model.js';
import SurveyModel from './survey.model.js';

const SurveyResponse = sequelize.define(
  'SurveyResponse',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    surveyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SurveyModel,
        key: 'id',
      },
    },
    respondentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: AccountModel,
        key: 'id',
      },
    },
    responses: {
      type: DataTypes.JSON,
      allowNull: false,
      // Structure: [{ questionId: number, answer: string | string[] }]
    },
  },
  {
    timestamps: true,
  },
);

export default SurveyResponse;