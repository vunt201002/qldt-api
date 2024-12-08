import SurveyModel from '../model/survey.model.js';
import {ValidationError} from 'sequelize';
import {getElementByField} from '../helpers/getElementByField.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import {deleteOne} from '../helpers/deleteOne.js';
import {NotFoundResponse} from '../reponse/Error.js';
import {OkResponse} from '../reponse/Success.js';
import catchError from '../reponse/catchError.js';

export const createOrUpdateSurvey = async (req, res) => {
  try {
    const {id} = req.params;
    const fileUrl = req?.files?.length ? `/uploads/${req.files[0].filename}` : req.body.fileUrl;

    if (id) {
      const surveyExists = await getElementByField({
        model: SurveyModel,
        value: id,
      });

      if (!surveyExists) {
        return NotFoundResponse({
          res,
          message: 'Survey not found.',
        });
      }
    }

    const {data: resp} = await createOrUpdate({
      model: SurveyModel,
      value: id || '',
      data: {...req.body, fileUrl},
    });

    return OkResponse({
      res,
      data: resp,
    });
  } catch (err) {
    return catchError({res, err, message: 'Error during create or update survey'});
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
        return NotFoundResponse({
          res,
          message: 'Survey not found.',
        });
      }
    }

    const {data: resp} = await deleteOne({
      model: SurveyModel,
      id,
    });

    return OkResponse({
      res,
      data: resp,
    });
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
