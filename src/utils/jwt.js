import jwt from 'jsonwebtoken';
import {ACCESS_TOKEN} from '../constant/token.js';

export const generateToken = (id, typeToken = ACCESS_TOKEN) => {
  const isAccessToken = typeToken === ACCESS_TOKEN;
  return jwt.sign(
    {id},
    isAccessToken ? process.env.JWT_ACCESS_SECRET : process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: isAccessToken
        ? process.env.JWT_ACCESS_TOKEN_EXPIRES_IN
        : process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    },
  );
};
