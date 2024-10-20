import ClassModel from '../model/class.model.js';
import StudentModel from '../model/student.model.js';

export async function getAllStudentClasses({id}) {
  return await ClassModel.findAll({
    include: {
      model: StudentModel,
      through: {
        attributes: [],
      },
      where: {
        id: id,
      },
    },
  });
}
