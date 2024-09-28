import crypto from 'crypto';

const verificationCodes = {};

export const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString('hex');
};

export const storeVerificationCode = (email, code) => {
  const expirationMinutes = parseInt(process.env.VERIFICATION_CODE_EXPIRATION, 10) || 600;
  verificationCodes[email] = {
    code,
    expires: Date.now() + expirationMinutes * 1000,
  };
  console.log(verificationCodes);
};

export const verifyCode = (email, inputCode) => {
  const record = verificationCodes[email];

  if (!record || record.code !== inputCode || Date.now() > record.expires) {
    return false;
  }

  delete verificationCodes[email];
  return true;
};
