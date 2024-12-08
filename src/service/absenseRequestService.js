import roleEnum from '../enumurator/role.enum.js';
import AbsenceRequestModel from '../model/absenceRequest.model.js';
import ClassModel from '../model/class.model.js';
import TeacherModel from '../model/teacher.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import StudentModel from '../model/student.model.js';

export async function canReviewAbsenceRequest({req, id: accountId}) {
  if (req.user.role === roleEnum.ADMIN) return true; // Admins can review any absence request

  const {id} = req.params; // Absence request ID
  const absenceRequest = await AbsenceRequestModel.findByPk(id, {
    include: [
      {
        model: ClassModel,
      },
    ],
  });

  if (!absenceRequest) return false; // Stop further execution and respond with an error

  // Find the teacher using the accountId from req.user.id
  const teacher = await TeacherModel.findOne({
    where: {accountId: accountId},
  });

  if (!teacher) return false; // Stop further execution and respond with an error

  // Check if the teacher's ID matches the teacherId of the class associated with the absence request
  return absenceRequest.Class.teacherId === teacher.id;
}

export async function verifyStudentSendAr({req, id}) {
  if (req.user.role === roleEnum.STUDENT) {
    const {studentId} = req.body;
    const student = await getElementByField({
      model: StudentModel,
      value: studentId,
    });

    if (!student) return false;
    return student.accountId === id;
  }

  return true;
}
