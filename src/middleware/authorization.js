import jwt from 'jsonwebtoken';
import roleEnum from '../enumurator/role.enum.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "You're not authenticated",
    });
  }

  const accessToken = token.split(' ')[1];

  try {
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: 'Token is not valid',
        });
      }
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(`Error when verify token`, err);
    return res.status(401).json({message: 'Invalid or expired token.'});
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === roleEnum.ADMIN) return next();

    return res.status(403).json({
      success: false,
      message: "You're not allowed to do that.",
    });
  });
};

export const verifyAccessApi = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === roleEnum.ADMIN || req.user.id === req.params.id) return next();

    return res.status(403).json({
      success: false,
      message: "You're not allowed to do that.",
    });
  });
};
