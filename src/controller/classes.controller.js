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
      case roleEnum.STUDENT:
        classes = await ClassModel.findAll({
          include: [
            {
              model: StudentModel,
              through: {
                where: {
                  studentId: id,
                },
              },
            },
          ],
        });
        break;
    }

    return res.status(200).json({
      success: true,
      message: 'Get all classes successfully',
      data: classes,
    });
  } catch (err) {
    console.error(`Error when get all class`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getOneClass = async (req, res) => {
  try {
    const {role, id: userId} = req.user;
    const {id: classId} = req.params;
    let classElement;

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
        break;
      }
    }

    if (!classElement)
      return res.status(404).json({
        success: false,
        message: 'Class not found or you do not have access to this class.',
      });

    return res.status(200).json({
      success: true,
      message: 'Get class successfully.',
      data: classElement,
    });
  } catch (err) {
    console.error(`Error during get one class`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
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
    const resp = await createOrUpdate({
      model: ClassModel,
      field: 'id',
      value: id || '',
      data: rest,
    });

    let invalidStudentIds = [];
    if (studentIds && Array.isArray(studentIds)) {
      const classInstance = await getElementByField({
        model: ClassModel,
        field: 'id',
        value: resp.data.id,
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
      invalidStudentIds = studentIds.filter((id) => !validStudentIds.includes(id));

      if (classInstance) {
        await classInstance.addStudents(validStudentIds);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Create or update class successfully',
      data: {...resp, invalidStudents: invalidStudentIds},
    });
  } catch (err) {
    console.error(`Error during create or update class`, err);

    if (err instanceof ValidationError) {
      const errorMessages = err.errors.map((error) => error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
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
