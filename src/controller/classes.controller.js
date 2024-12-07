import getAll from '../helpers/getAll.js';
import ClassModel from '../model/class.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import sequelize from '../database/connect.js';
import roleEnum from '../enumurator/role.enum.js';
import StudentModel from '../model/student.model.js';
import TeacherModel from '../model/teacher.model.js';
import AccountModel from '../model/account.model.js';
import {OkResponse} from '../reponse/Success.js';
import catchError from '../reponse/catchError.js';
import {ForbiddenResponse, InvalidResponse, NotFoundResponse} from '../reponse/Error.js';
import {getCurrentStudentCount, hasScheduleOverlap} from '../service/classService.js';

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
    const {studentIds, semester: reqSemester, schedule: reqSchedule, ...rest} = req.body;

    let classInstance = null;
    if (id) {
      classInstance = await ClassModel.findByPk(id, {
        include: [
          {
            model: StudentModel,
            attributes: ['id'], // Only need IDs for comparison
          },
        ],
      });
      if (!classInstance) {
        return NotFoundResponse({
          res,
          message: 'Class not found.',
        });
      }
    }

    const semesterToCheck = reqSemester || classInstance?.semester;
    const scheduleToCheck = reqSchedule || classInstance?.schedule;

    if (await hasScheduleOverlap(semesterToCheck, scheduleToCheck, id)) {
      return InvalidResponse({
        res,
        message: 'Schedule conflict detected for the requested semester.',
      });
    }

    const updateData = {
      ...classInstance?.get({plain: true}),
      ...rest,
      semester: semesterToCheck,
      schedule: scheduleToCheck,
    };

    const {data: updatedClass} = await createOrUpdate({
      model: ClassModel,
      field: 'id',
      value: id || '',
      data: updateData,
    });

    if (studentIds && Array.isArray(studentIds)) {
      const currentStudentIds = classInstance ? classInstance.Students.map((s) => s.id) : [];
      const newStudentIds = studentIds.filter((id) => !currentStudentIds.includes(id));

      const newStudentCount = newStudentIds.length;
      const currentStudentCount = currentStudentIds.length;
      const maxStudentsAllowed = updatedClass.maxStudent;

      if (currentStudentCount + newStudentCount > maxStudentsAllowed) {
        return InvalidResponse({
          res,
          message: 'Adding these students would exceed the maximum class capacity.',
        });
      }

      if (newStudentCount > 0) {
        // Proceed with adding new students only if there are any
        const validStudents = await StudentModel.findAll({
          where: {id: newStudentIds},
          attributes: ['id'],
          include: {
            model: AccountModel,
            attributes: ['id'],
            where: {status: 'ACTIVE'},
          },
        });

        const validStudentIds = validStudents.map((student) => student.id);
        await updatedClass.addStudents(validStudentIds); // Use addStudents to add to existing list
      }
    }

    return OkResponse({
      res,
      message: 'Create or update class successfully',
      data: updatedClass,
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
