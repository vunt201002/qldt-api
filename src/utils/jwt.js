import jwt from 'jsonwebtoken';
import {ACCESS_TOKEN} from '../constant/token.js';

export const generateToken = (id, typeToken = ACCESS_TOKEN) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn:
      typeToken === ACCESS_TOKEN
        ? process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
        : process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  });
};
