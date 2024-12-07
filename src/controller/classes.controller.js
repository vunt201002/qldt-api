import getAll from '../helpers/getAll.js';
import ClassModel from '../model/class.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import sequelize from '../database/connect.js';
import {ValidationError} from 'sequelize';
import roleEnum from '../enumurator/role.enum.js';
import StudentModel from '../model/student.model.js';
import TeacherModel from '../model/teacher.model.js';
import AccountModel from '../model/account.model.js';
import {OkResponse} from '../reponse/Success.js';
import catchError from '../reponse/catchError.js';
import {ForbiddenResponse, NotFoundResponse} from '../reponse/Error.js';

export const getAllClasses = async (req, res) => {
  try {
    const {role, id} = req.user;
    let classes = [];

    switch (role) {
      case roleEnum.ADMIN:
        classes = await getAll({model: ClassModel});
        break;
      case roleEnum.TEACHER:
        classes = await ClassModel.findAll({
          include: [
            {
              model: TeacherModel,
              where: {
                accountId: id,
              },
            },
          ],
        });
        break;
      case roleEnum.STUDENT: {
        const student = await StudentModel.findOne({
          where: {accountId: id},
          attributes: ['id'],
        });
        if (!student) {
          return NotFoundResponse({
            res,
            message: 'Student not found',
          });
        }
        classes = await ClassModel.findAll({
          include: [
            {
              model: StudentModel,
              as: 'Students',
              required: true,
              through: {
                attributes: [],
                where: {studentId: student.id},
              },
            },
          ],
        });
      }
    }

    return OkResponse({res, message: 'Get all classes successfully', data: classes});
  } catch (err) {
    return catchError({res, err, message: 'Error getting all classes'});
  }
};

export const getOneClass = async (req, res) => {
  try {
    const {role, id: userId} = req.user;
    const {id: classId} = req.params;
    let classElement;
    let hasAccess = true;

    switch (role) {
      case roleEnum.ADMIN:
        classElement = await getElementByField({
          model: ClassModel,
          field: 'id',
          value: classId,
        });
        break;

      case roleEnum.TEACHER:
        classElement = await ClassModel.findOne({
          where: {
            id: classId,
            teacherId: userId,
          },
        });
        hasAccess = !!classElement;
        break;
      case roleEnum.STUDENT: {
        const studentInstance = await StudentModel.findOne({
          where: {id: userId},
          include: {
            model: ClassModel,
            where: {id: classId},
            through: {attributes: []},
          },
        });
        classElement = studentInstance ? studentInstance.Classes[0] : null;
        hasAccess = !!classElement;
        break;
      }
      default:
        return ForbiddenResponse({res});
    }

    if (!classElement) return NotFoundResponse({res});

    if (!hasAccess) return ForbiddenResponse({res});

    return OkResponse({res, message: 'Get class successfully.', data: classElement});
  } catch (err) {
    return catchError({res, err, message: 'Error during get one class'});
  }
};

export const getClassSchedule = async (req, res) => {
  try {
    const {id} = req.params;

    const resp = await ClassModel.findOne({
      where: {
        id: id,
      },
      attributes: ['schedule'],
    });

    return res.status(200).json({
      success: true,
      message: 'Get class schedule successfully',
      data: JSON.parse(resp.schedule),
    });
  } catch (err) {
    console.error(`Error during get class schedule`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createOrUpdateClass = async (req, res) => {
  try {
    const {id} = req.params;
    const {studentIds, ...rest} = req.body;
    const {data: resp} = await createOrUpdate({
      model: ClassModel,
      field: 'id',
      value: id || '',
      data: rest,
    });

    if (studentIds && Array.isArray(studentIds)) {
      const classInstance = await getElementByField({
        model: ClassModel,
        field: 'id',
        value: resp.id,
      });

      const validStudents = await StudentModel.findAll({
        where: {
          id: studentIds,
        },
        attributes: ['id'],
        include: {
          model: AccountModel,
          attributes: ['id'],
          where: {status: 'ACTIVE'},
        },
      });

      const validStudentIds = validStudents.map((student) => student.id);

      if (classInstance) {
        await classInstance.setStudents(validStudentIds);
      }
    }

    return OkResponse({
      res,
      message: 'Create or update class successfully',
      data: resp,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during create or update class',
    });
  }
};

export const deleteClass = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {id} = req.params;

    const classInstance = await getElementByField({
      model: ClassModel,
      field: 'id',
      value: id,
    });

    if (!classInstance) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    await classInstance.removeStudents(await classInstance.getStudents());
    await classInstance.destroy();

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (err) {
    console.error(`Error during delete class`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
