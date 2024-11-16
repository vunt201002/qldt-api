import SurveyModel from '../model/survey.model.js';
import {ValidationError} from 'sequelize';
import {getElementByField} from '../helpers/getElementByField.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import {deleteOne} from '../helpers/deleteOne.js';

export const createOrUpdateSurvey = async (req, res) => {
  try {
    const {id} = req.params;

    if (id) {
      const surveyExists = await getElementByField({
        model: SurveyModel,
        value: id,
      });

      if (!surveyExists) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found.',
        });
      }
    }

    const resp = await createOrUpdate({
      model: SurveyModel,
      value: id || '',
      data: req.body,
    });

    return res.status(200).json(resp);
  } catch (err) {
    console.error(`Error during create or update survey:`, err);

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

export const deleteSurvey = async (req, res) => {
  try {
    const {id} = req.params;

    if (id) {
      const surveyExists = await getElementByField({
        model: SurveyModel,
        value: id,
      });

      if (!surveyExists) {
        return res.status(404).json({
          success: false,
          message: 'Survey not found.',
        });
      }
    }

    const resp = await deleteOne({
      model: SurveyModel,
      id,
    });

    return res.status(200).json(resp);
  } catch (err) {
    console.error(`Error during delete survey:`, err);

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
