import {ValidationError} from 'sequelize';
import StudentModel from '../model/student.model.js';
import ClassModel from '../model/class.model.js';
import AbsenceRequestModel from '../model/absenceRequest.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import roleEnum from '../enumurator/role.enum.js';
import getAll from '../helpers/getAll.js';
import TeacherModel from '../model/teacher.model.js';

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
          return res.status(403).json({
            success: false,
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
          return res.status(403).json({
            success: false,
            message: 'You are not authorized to view these absence requests.',
          });
        }

        absenceRequests = await AbsenceRequestModel.findAll({
          where: {studentId: student.id},
        });
        break;
      }

      default:
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to view these absence requests.',
        });
    }

    return res.status(200).json({
      success: true,
      message: 'Absence requests fetched successfully.',
      data: absenceRequests,
    });
  } catch (err) {
    console.error(`Error during fetching absence requests:`, err);

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

export const createOrUpdateAbsenceRequest = async (req, res) => {
  try {
    const {id = ''} = req.params;
    const {classId = '', studentId = ''} = req.body;

    if (studentId) {
      const student = await getElementByField({
        model: StudentModel,
        value: studentId || '',
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Student not found.',
        });
      }
    }

    if (classId) {
      const classExists = await getElementByField({
        model: ClassModel,
        value: classId || '',
      });
      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: 'Class not found.',
        });
      }
    }

    if (id) {
      const absenceRequest = await getElementByField({
        model: AbsenceRequestModel,
        value: id || '',
      });

      if (!absenceRequest) {
        return res.status(404).json({
          success: false,
          message: 'Absence request not found.',
        });
      }
    }

    const resp = await createOrUpdate({
      model: AbsenceRequestModel,
      value: id || '',
      data: req.body,
    });

    return res.status(200).json(resp);
  } catch (err) {
    console.error(`Error during create or update absence request:`, err);

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
