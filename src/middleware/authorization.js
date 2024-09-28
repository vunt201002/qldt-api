import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({message: 'No token provided.'});
  }

  const accessToken = token.split(' ')[1];

  try {
    req.user = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
    next();
  } catch (err) {
    console.log(`Error when verify token`, err);
    return res.status(401).json({message: 'Invalid or expired token.'});
  }
};
