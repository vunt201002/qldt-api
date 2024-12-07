import ClassModel from '../model/class.model.js';
import {timeOverlaps} from '../utils/time.js';
import {Op} from 'sequelize';
import StudentModel from '../model/student.model.js';

export async function hasScheduleOverlap(semester, newSchedule, classId) {
  const classes = await ClassModel.findAll({
    where: {
      semester: semester,
      ...(classId && {id: {[Op.ne]: classId}}), // Only add this condition if classId is not null
    },
    attributes: ['id', 'schedule'],
  });

  for (const cls of classes) {
    const existingSchedule = JSON.parse(cls.schedule || "day: [], time: ''");

    console.log('Existing Schedule:', existingSchedule);
    console.log('New Schedule:', newSchedule);

    // Check for overlapping days
    const commonDays = existingSchedule.days.filter((day) => newSchedule.days.includes(day));
    if (commonDays.length > 0) {
      const overlaps = timeOverlaps(existingSchedule.time, newSchedule.time);
      console.log('Overlaps:', overlaps);
      if (overlaps) {
        return true; // Overlap found
      }
    }
  }

  return false; // No overlap
}

export async function getCurrentStudentCount(classId) {
  const classInstance = await ClassModel.findByPk(classId, {
    include: [
      {
        model: StudentModel,
        as: 'Students', // Adjust this alias based on your model association setup
        attributes: ['id'],
      },
    ],
  });

  return classInstance ? classInstance.Students.length : 0;
}
