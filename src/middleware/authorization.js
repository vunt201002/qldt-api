import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({message: 'No token provided.'});
  }

  try {
    req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (err) {
    console.log(`Error when verify token`, err);
    return res.status(401).json({message: 'Invalid or expired token.'});
  }
};
