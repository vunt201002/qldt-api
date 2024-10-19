import {generateRandomCode} from '../utils/crypto.js';
import statusAccountEnum from '../enumurator/statusAccount.enum.js';
import {sendVerificationCode} from './sendMailService.js';

const verificationCodes = {};

export const storeVerificationCode = (id, code) => {
  const expirationMinutes = parseInt(process.env.VERIFICATION_CODE_EXPIRATION, 10) || 600;
  verificationCodes[id] = {
    code,
    expires: Date.now() + expirationMinutes * 1000,
  };
};

export const getVerifyCode = async (account) => {
  if (account.status === statusAccountEnum.ACTIVE) return null;

  const code = generateRandomCode();
  storeVerificationCode(account.id, code);
  await sendVerificationCode(account, code);

  return code;
};

export const verifyCode = (email, inputCode) => {
  const record = verificationCodes[email];

  if (!record) {
    console.log(`Verify code not found`);
    return false;
  }

  if (record.code !== inputCode) {
    console.log(`Verify code is wrong`, record);
    return false;
  }

  if (Date.now() > record.expires) {
    console.log(`Verify code expired`);
    return false;
  }

  delete verificationCodes[email];
  return true;
};
