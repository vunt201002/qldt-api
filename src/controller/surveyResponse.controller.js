import {ValidationError} from 'sequelize';
import {getElementByField} from '../helpers/getElementByField.js';
import SurveyResponseModel from '../model/surveyResponse.model.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import SurveyModel from '../model/survey.model.js';
import getAll from '../helpers/getAll.js';

export const createOrUpdateSurveyResponse = async (req, res) => {
  try {
    const {id} = req.params;
    const {surveyId} = req.body;

    if (surveyId) {
      const surveyExists = await getElementByField({
        model: SurveyModel,
        value: surveyId,
      });

      if (!surveyExists) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found.',
        });
      }
    }

    if (id) {
      const surveyExists = await getElementByField({
        model: SurveyResponseModel,
        value: id,
      });

      if (!surveyExists) {
        return res.status(404).json({
          success: false,
          message: 'Survey response not found.',
        });
      }
    }

    const resp = await createOrUpdate({
      model: SurveyResponseModel,
      value: id || '',
      data: req.body,
    });

    return res.status(200).json(resp);
  } catch (err) {
    console.error(`Error during create or update survey response:`, err);

    if (err instanceof ValidationError) {
      const errorMessages = err.errors.map((error) => error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error.',
        errors: errorMessages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export const getAllSurveyResponses = async (req, res) => {
  try {
    const resp = await getAll({
      model: SurveyResponseModel,
    });

    return res.status(200).json({
      success: true,
      message: 'Survey responses fetched.',
      data: resp,
    });
  } catch (err) {
    console.error(`Error during get survey response:`, err);

    if (err instanceof ValidationError) {
      const errorMessages = err.errors.map((error) => error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error.',
        errors: errorMessages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};
