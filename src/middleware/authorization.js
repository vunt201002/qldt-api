import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({
      success: false,
      message: 'No token provided.',
    });
  }

  const accessToken = token.split(' ')[1];

  try {
    jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({
          success: false,
          err,
          message: 'Token is not valid',
        });
      }
      console.log('userhere', user);
      req.user = user;
      next();
    });
  } catch (err) {
    console.log(`Error when verify token`, err);
    return res.status(401).json({message: 'Invalid or expired token.'});
  }
};
