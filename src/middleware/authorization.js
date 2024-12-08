import jwt from 'jsonwebtoken';
import roleEnum from '../enumurator/role.enum.js';
import {ForbiddenResponse, NotFoundResponse} from '../reponse/Error.js';
import catchError from '../reponse/catchError.js';
import ClassModel from '../model/class.model.js';
import TeacherModel from '../model/teacher.model.js';
import StudentModel from '../model/student.model.js';
import MaterialModel from '../model/material.model.js';
import SurveyModel from '../model/survey.model.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return ForbiddenResponse({
      res,
      message: "You're not authenticated.",
    });
  }

  const accessToken = token.split(' ')[1];

  try {
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        console.log(accessToken);
        console.log(err);
        return ForbiddenResponse({
          res,
          message: 'Token is not valid',
        });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    return catchError({res, err, message: 'Error when verify token'});
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === roleEnum.ADMIN) return next();

    return ForbiddenResponse({
      res,
      message: 'Not allowed',
    });
  });
};

export const verifyRoleAndCondition =
  (allowedRoles, conditionCheck = null) =>
  async (req, res, next) => {
    verifyToken(req, res, async () => {
      const {role, id} = req.user;

      if (!allowedRoles.includes(role)) {
        return ForbiddenResponse({
          res,
          message: 'Not authorized to access this endpoint',
        });
      }

      if (conditionCheck && typeof conditionCheck === 'function') {
        try {
          const conditionResult = await conditionCheck(req, id);
          if (!conditionResult) {
            return ForbiddenResponse({
              res,
              message: 'Not authorized to perform this action',
            });
          }
        } catch (error) {
          return catchError({res, err: error, message: 'Error during authorization check'});
        }
      }

      return next();
    });
  };

export const verifyAccessApi = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === roleEnum.ADMIN || req.user.id === req.params.id) return next();

    return ForbiddenResponse({
      res,
      message: 'Not allowed',
    });
  });
};

export const verifyRoleAndClassMembership = (req, res, next) => {
  verifyToken(req, res, async () => {
    const {user} = req;
    let {classId, id: materialId} = req.params;
    console.log({classId, materialId}, 'oiqurowie');
    if (!classId && materialId) {
      try {
        const material = await MaterialModel.findByPk(materialId, {include: [{model: ClassModel}]});
        if (!material) {
          return NotFoundResponse({res, message: 'Material not found.'});
        }
        classId = material.classId; // Set classId for subsequent checks
      } catch (err) {
        return catchError({res, err, message: 'Error fetching material information'});
      }
    }

    if (user.role === roleEnum.ADMIN) {
      return next(); // Admins can access any class
    } else if (user.role === roleEnum.TEACHER) {
      // First retrieve the teacherId using the accountId from the user
      TeacherModel.findOne({
        where: {accountId: user.id},
        attributes: ['id'], // Assuming the primary key is 'id' for the teacher
      })
        .then((teacher) => {
          if (!teacher) {
            return ForbiddenResponse({
              res,
              message: 'Teacher not found.',
            });
          }
          // Check if the teacher is associated with the class
          ClassModel.findOne({
            where: {
              id: classId,
              teacherId: teacher.id, // Now using the actual teacherId
            },
          })
            .then((classInstance) => {
              if (classInstance) {
                return next();
              } else {
                return ForbiddenResponse({
                  res,
                  message: 'Not authorized to access this endpoint',
                });
              }
            })
            .catch((err) => {
              return catchError({res, err, message: 'Error during authorization check'});
            });
        })
        .catch((err) => {
          return catchError({res, err, message: 'Error finding teacher information'});
        });
    } else if (user.role === roleEnum.STUDENT) {
      // Check if the student is linked through a many-to-many relationship
      ClassModel.findByPk(classId, {
        include: [
          {
            model: StudentModel,
            where: {accountId: user.id}, // Assuming `accountId` links StudentModel to User
            required: true,
          },
        ],
      })
        .then((classInstance) => {
          if (classInstance) {
            return next();
          } else {
            return ForbiddenResponse({
              res,
              message: 'Not authorized to access this endpoint',
            });
          }
        })
        .catch((err) => {
          return catchError({res, err, message: 'Error during authorization check'});
        });
    }
  });
};

export const verifyRoleAndClassMembershipForSurvey = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const {user} = req; // Assumes `req.user` is set from a previous authentication middleware
      const {id} = req.params; // Survey ID from URL, might not exist for create operation
      const {classId} = req.body; // Expected in body for create operation

      if (user.role === roleEnum.ADMIN) {
        return next(); // Admins can operate on any survey regardless of the operation
      }

      // For creating a new survey, ensure classId is provided
      if (!id && !classId) {
        return ForbiddenResponse({
          res,
          message: 'Class ID is required for creating a survey.',
        });
      }

      const actualClassId = id
        ? (await SurveyModel.findByPk(id, {include: [{model: ClassModel}]})).classId
        : classId;

      // Retrieve the teacher record using the accountId from req.user
      const teacher = await TeacherModel.findOne({
        where: {accountId: user.id},
      });

      if (!teacher) {
        return ForbiddenResponse({
          res,
          message: 'Teacher not found with provided account ID.',
        });
      }

      // Verify if the teacher is associated with the class of the survey
      const classInstance = await ClassModel.findByPk(actualClassId);
      if (classInstance && classInstance.teacherId === teacher.id) {
        return next();
      }

      return ForbiddenResponse({
        res,
        message: 'Not authorized to access or modify this survey.',
      });
    } catch (err) {
      return catchError({res, err, message: 'Error during authorization check.'});
    }
  });
};
