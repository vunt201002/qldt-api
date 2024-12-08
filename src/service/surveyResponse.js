import SurveyResponseModel from '../model/surveyResponse.model.js';
import SurveyModel from '../model/survey.model.js';
import ClassModel from '../model/class.model.js';
import roleEnum from '../enumurator/role.enum.js';
import {InvalidResponse, NotFoundResponse} from '../reponse/Error.js';
import TeacherModel from '../model/teacher.model.js';

export const canGradeResponses = async ({req, res, id: accountId}) => {
  const {responses} = req.body; // Assume responses is an array of { responseId, grade }

  if (!responses || responses.length === 0) {
    return InvalidResponse({
      res,
      message: 'No survey responses provided for grading.',
    });
  }

  const responseIds = responses.map((item) => item.responseId);

  // Fetch all responses at once, including necessary relational data
  const surveyResponses = await SurveyResponseModel.findAll({
    where: {
      id: responseIds,
    },
    include: [
      {
        model: SurveyModel,
        include: [
          {
            model: ClassModel,
          },
        ],
      },
    ],
  });

  if (surveyResponses.length !== responses.length)
    return NotFoundResponse({
      res,
      message: 'One or more survey responses not found.',
    });

  if (req.user.role === roleEnum.ADMIN) return true; // Admin can grade any response

  if (req.user.role === roleEnum.TEACHER) {
    const teacher = await TeacherModel.findOne({where: {accountId: accountId}});
    if (!teacher) {
      return NotFoundResponse({
        res,
        message: 'Teacher not found.',
      });
    }
    return surveyResponses.every((response) => response.Survey.Class.teacherId === teacher.id);
  }

  // Students are not allowed to grade responses
  return false;
};
