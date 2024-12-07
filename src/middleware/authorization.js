import jwt from 'jsonwebtoken';
import roleEnum from '../enumurator/role.enum.js';
import {ForbiddenResponse} from '../reponse/Error.js';
import catchError from '../reponse/catchError.js';

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
