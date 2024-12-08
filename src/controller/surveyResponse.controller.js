import {getElementByField} from '../helpers/getElementByField.js';
import SurveyResponseModel from '../model/surveyResponse.model.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import SurveyModel from '../model/survey.model.js';
import {InvalidResponse, NotFoundResponse} from '../reponse/Error.js';
import {OkResponse} from '../reponse/Success.js';
import catchError from '../reponse/catchError.js';
import roleEnum from '../enumurator/role.enum.js';
import ClassModel from '../model/class.model.js';
import StudentModel from '../model/student.model.js';
import AccountModel from '../model/account.model.js';
import TeacherModel from '../model/teacher.model.js';
import sequelize from '../database/connect.js';

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
        return NotFoundResponse({res, message: 'Survey not found.'});
      }
    }

    if (id) {
      const surveyExists = await getElementByField({
        model: SurveyResponseModel,
        value: id,
      });

      if (!surveyExists) {
        return NotFoundResponse({
          res,
          message: 'Survey response not found',
        });
      }
    }

    const {data: resp} = await createOrUpdate({
      model: SurveyResponseModel,
      value: id || '',
      data: req.body,
    });

    return OkResponse({
      res,
      data: resp,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during create or update survey response',
    });
  }
};

export const getAllSurveyResponses = async (req, res) => {
  try {
    const {user} = req; // Assuming user info is set in req.user

    let where = {};

    if (user.role === roleEnum.STUDENT) {
      // Find studentId from accountId
      const student = await StudentModel.findOne({
        where: {accountId: user.id},
      });
      if (!student) {
        return NotFoundResponse({res, message: 'Student not found.'});
      }
      // Students can only see their own survey responses
      where.studentId = student.id;
    } else if (user.role === roleEnum.TEACHER) {
      // Find teacherId from accountId
      const teacher = await TeacherModel.findOne({
        where: {accountId: user.id},
      });
      if (!teacher) {
        return NotFoundResponse({res, message: 'Teacher not found.'});
      }
      // Teachers can see survey responses from their classes
      const classes = await ClassModel.findAll({
        where: {teacherId: teacher.id},
        attributes: ['id'],
      });
      const classIds = classes.map((c) => c.id);
      const surveys = await SurveyModel.findAll({
        where: {classId: classIds},
        attributes: ['id'],
      });
      where.surveyId = surveys.map((s) => s.id);
    } // Admins can see all responses, so no 'where' clause is added

    const responses = await SurveyResponseModel.findAll({
      where,
      include: [
        {
          model: SurveyModel,
          include: [{model: ClassModel}],
        },
        {
          model: StudentModel,
          include: [{model: AccountModel}],
        },
      ],
    });

    return OkResponse({
      res,
      message: 'Survey responses fetched.',
      data: responses,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during get survey responses',
    });
  }
};

export const gradeSurveyResponses = async (req, res) => {
  const {responses} = req.body;
  console.log(responses, 'afdasdfsdfasdsfd');
  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    return InvalidResponse({
      res,
      message: 'Invalid or missing grading data.',
    });
  }

  const transaction = await sequelize.transaction();
  try {
    for (const {responseId, grade} of responses) {
      const update = await SurveyResponseModel.update(
        {grade},
        {
          where: {id: responseId},
          transaction,
        },
      );

      if (update[0] === 0) {
        // Check the number of affected rows
        return NotFoundResponse({
          res,
          message: `Survey response not found: ${responseId}`,
        });
      }
    }
    await transaction.commit();
    return OkResponse({res, message: 'Survey responses graded successfully.', data: responses});
  } catch (err) {
    await transaction.rollback();
    return catchError({res, err});
  }
};
