import ClassModel from '../model/class.model.js';
import TeacherModel from '../model/teacher.model.js';

const isTeacherOwnerOfClass = async ({req, id: teacherId}) => {
  const classId = req.params.id;
  const classInstance = await ClassModel.findOne({
    where: {id: classId},
    include: [
      {
        model: TeacherModel,
        where: {accountId: teacherId},
        required: true,
      },
    ],
  });
  return !!classInstance;
};

export default isTeacherOwnerOfClass;
