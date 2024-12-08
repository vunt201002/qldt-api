import {ValidationError} from 'sequelize';
import StudentModel from '../model/student.model.js';
import ClassModel from '../model/class.model.js';
import AbsenceRequestModel from '../model/absenceRequest.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import roleEnum from '../enumurator/role.enum.js';
import getAll from '../helpers/getAll.js';
import TeacherModel from '../model/teacher.model.js';
import {
  ForbiddenResponse,
  InvalidResponse,
  NotEnoughParams,
  NotFoundResponse,
} from '../reponse/Error.js';
import catchError from '../reponse/catchError.js';
import {OkResponse} from '../reponse/Success.js';
import sequelize from '../database/connect.js';

export const getAllAbsenceRequests = async (req, res) => {
  try {
    const {id: accountId, role} = req.user;
    let absenceRequests = [];

    switch (role) {
      case roleEnum.ADMIN:
        absenceRequests = await getAll({model: AbsenceRequestModel});
        break;

      case roleEnum.TEACHER: {
        const teacher = await TeacherModel.findOne({
          where: {accountId},
        });

        if (!teacher) {
          return ForbiddenResponse({
            res,
            message: 'You are not authorized to view these absence requests.',
          });
        }

        absenceRequests = await AbsenceRequestModel.findAll({
          include: [
            {
              model: ClassModel,
              where: {teacherId: teacher.id},
            },
          ],
        });
        break;
      }

      case roleEnum.STUDENT: {
        const student = await StudentModel.findOne({
          where: {accountId},
        });

        if (!student) {
          return ForbiddenResponse({
            res,
            message: 'You are not authorized to view these absence requests.',
          });
        }

        absenceRequests = await AbsenceRequestModel.findAll({
          where: {studentId: student.id},
        });
        break;
      }

      default:
        return ForbiddenResponse({
          res,
          message: 'You are not authorized to view these absence requests.',
        });
    }

    return OkResponse({
      res,
      message: 'Absence requests fetched successfully.',
      data: absenceRequests,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during fetching absence requests',
    });
  }
};

export const createOrUpdateAbsenceRequest = async (req, res) => {
  try {
    const {id = ''} = req.params;
    const {classId = '', studentId = ''} = req.body;

    if (!classId || !studentId) {
      return NotEnoughParams({
        res,
        message: 'Class ID and Student ID are required fields',
      });
    }

    const [student, classExists] = await Promise.all([
      getElementByField({
        model: StudentModel,
        value: studentId || '',
      }),
      getElementByField({
        model: ClassModel,
        value: classId || '',
      }),
    ]);

    if (!student)
      return NotFoundResponse({
        res,
        message: 'Student not found.',
      });

    if (!classExists)
      return NotFoundResponse({
        res,
        message: 'Class not found.',
      });

    if (id) {
      const absenceRequest = await getElementByField({
        model: AbsenceRequestModel,
        value: id || '',
      });

      if (!absenceRequest) {
        return NotFoundResponse({
          res,
          message: 'Absence request not found.',
        });
      }
    }

    const {data: resp} = await createOrUpdate({
      model: AbsenceRequestModel,
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
      message: 'Error during create or update absence request',
    });
  }
};

export const reviewAbsenceRequests = async (req, res) => {
  const {absenseReq} = req.body; // Expecting an array of { id, newStatus }

  if (!absenseReq || !Array.isArray(absenseReq) || absenseReq.length === 0) {
    return InvalidResponse({
      res,
      message: 'Invalid or missing data for absence request.',
    });
  }

  const transaction = await sequelize.transaction(); // Start a transaction for rollback capabilities on error
  try {
    let teacherId = null;

    // If the user is a teacher, find their teacher ID using their account ID
    if (req.user.role === roleEnum.TEACHER) {
      const teacher = await TeacherModel.findOne({
        where: {accountId: req.user.id},
        transaction,
      });
      if (!teacher) {
        await transaction.rollback();
        return NotFoundResponse({
          res,
          message: 'Teacher not found.',
        });
      }
      teacherId = teacher.id;
    }

    for (const update of absenseReq) {
      const {id, status} = update;

      const absenceRequest = await AbsenceRequestModel.findByPk(id, {
        include: [
          {
            model: ClassModel,
          },
        ],
        transaction,
      });

      if (!absenceRequest) {
        continue; // Skip to the next update if the absence request does not exist
      }

      // Verify if the teacher is updating a request from their class
      if (teacherId && absenceRequest.Class.teacherId !== teacherId) {
        continue; // Skip updates not belonging to the teacher's class
      }

      // Update the absence request with the new status and current timestamp
      await absenceRequest.update(
        {
          status: status,
          responseDate: new Date(), // Set the response date to now
        },
        {
          transaction,
        },
      );
    }

    await transaction.commit();
    return OkResponse({
      res,
      message: 'Absence requests updated successfully.',
      data: absenseReq.filter((req) => req), // Optionally filter out non-updated requests before returning
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({message: error.message || 'Failed to update absence requests.'});
  }
};
