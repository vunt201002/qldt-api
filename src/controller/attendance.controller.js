import ClassModel from '../model/class.model.js';
import StudentModel from '../model/student.model.js';
import AttendanceModel from '../model/attendance.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import {ValidationError} from 'sequelize';
import statusAttendanceEnum from '../enumurator/statusAttendance.enum.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';

export const getStudentAttendance = async (req, res) => {
  try {
    const {studentId} = req.params;
    const {id: accountId} = req.user;

    const student = await StudentModel.findOne({
      where: {accountId},
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found for the logged-in account.',
      });
    }

    if (studentId !== student.id)
      return res.status(403).json({
        success: false,
        message: 'Forbidden',
      });

    const attendanceRecords = await AttendanceModel.findAll({
      where: {studentId: studentId},
      include: {
        model: ClassModel,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Attendance records fetched successfully.',
      data: attendanceRecords,
    });
  } catch (err) {
    console.error(`Error during get attendance`, err);

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
      message: 'Internal server error.',
    });
  }
};

export const takeAttendance = async (req, res) => {
  try {
    const {date, classId, studentIds} = req.body;

    const classExists = await getElementByField({
      model: ClassModel,
      value: classId,
    });
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: 'Class not found.',
      });
    }

    const validStudents = await StudentModel.findAll({
      where: {
        id: studentIds,
      },
      include: {
        model: ClassModel,
        where: {id: classId},
      },
    });

    const validStudentIds = validStudents.map((student) => student.id);
    const invalidStudentIds = studentIds.filter((id) => !validStudentIds.includes(id));

    const attendanceRecords = await Promise.all(
      validStudentIds.map((studentId) =>
        AttendanceModel.create({
          date,
          classId,
          studentId,
          status: statusAttendanceEnum.ABSENT_UNEXCUSED,
        }),
      ),
    );

    return res.status(200).json({
      success: true,
      message: 'Attendance records created successfully.',
      data: attendanceRecords,
      invalidStudentIds,
    });
  } catch (err) {
    console.error(`Error during attendance marking:`, err);

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
      message: 'Internal server error.',
    });
  }
};

export const createOrUpdateAttendance = async (req, res) => {
  try {
    const {id} = req.params;
    const {classId = '', studentId = ''} = req.body;

    if (classId) {
      const classExists = await getElementByField({
        model: ClassModel,
        value: classId,
      });
      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: 'Class not found.',
        });
      }
    }

    if (studentId) {
      const studentExists = await StudentModel.findOne({
        where: {id: studentId},
        include: {
          model: ClassModel,
          where: {id: classId},
        },
      });

      if (!studentExists) {
        return res.status(404).json({
          success: false,
          message: 'Student not found in the specified class.',
        });
      }
    }

    if (id) {
      const attendanceExists = await getElementByField({
        model: AttendanceModel,
        value: id,
      });

      if (!attendanceExists) {
        return res.status(404).json({
          success: false,
          message: 'Attendance record not found.',
        });
      }
    }

    const resp = await createOrUpdate({
      model: AttendanceModel,
      value: id || '',
      data: req.body,
    });

    return res.status(201).json(resp);
  } catch (err) {
    console.error(`Error during create or update attendance:`, err);

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

export const getClassAttendance = async (req, res) => {
  try {
    const {classId} = req.params;
    const {date} = req.query;

    if (!classId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: classId or date.',
      });
    }

    const classExists = await ClassModel.findOne({
      where: {id: classId},
    });

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: 'Class not found or you are not authorized to view attendance for this class.',
      });
    }

    const attendanceRecords = await AttendanceModel.findAll({
      where: {
        classId,
        date: new Date(date),
      },
      include: {
        model: StudentModel,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Attendance records fetched successfully.',
      data: attendanceRecords,
    });
  } catch (err) {
    console.error(`Error during fetching attendance records:`, err);

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
