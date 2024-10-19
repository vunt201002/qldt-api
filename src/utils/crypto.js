import crypto from 'crypto';

export const generateRandomCode = () => {
  return crypto.randomBytes(3).toString('hex');
};
