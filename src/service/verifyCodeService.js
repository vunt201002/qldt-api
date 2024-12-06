import {generateRandomCode} from '../utils/crypto.js';
import statusAccountEnum from '../enumurator/statusAccount.enum.js';
import {sendVerificationCode} from './sendMailService.js';

const verificationCodes = {};

export const storeVerificationCode = (id, code) => {
  const expirationSeconds = parseInt(process.env.VERIFICATION_CODE_EXPIRATION, 10) || 600;
  const newCodeEntry = {
    code,
    expires: Date.now() + expirationSeconds * 1000,
    lastRequested: Date.now(),
  };

  if (!verificationCodes[id]) {
    verificationCodes[id] = {codes: [], lastRequested: 0};
  }

  verificationCodes[id].codes.push(newCodeEntry);
  verificationCodes[id].lastRequested = Date.now();

  // Optionally, clean up expired codes
  verificationCodes[id].codes = verificationCodes[id].codes.filter(
    (entry) => Date.now() < entry.expires,
  );
};

export const getVerifyCode = async (account) => {
  if (account.status === statusAccountEnum.ACTIVE) return null;

  const currentTime = Date.now();
  const lastRequested = verificationCodes[account.id]
    ? verificationCodes[account.id].lastRequested
    : 0;
  const requestInterval = process.env.LIMIT_GET_VERIFY_CODE_TIME * 1000;

  if (currentTime - lastRequested < requestInterval) {
    return null;
  }

  const code = generateRandomCode();
  storeVerificationCode(account.id, code);
  await sendVerificationCode(account, code);

  return code;
};

export const verifyCode = (id, inputCode) => {
  const records = verificationCodes[id];

  if (!records || !records.length) {
    console.log('Verify code not found', id);
    return false;
  }

  const validRecord = records.find(
    (record) => record.code === inputCode && Date.now() <= record.expires,
  );

  if (!validRecord) {
    console.log('Verify code is wrong or expired', id);
    return false;
  }

  return true;
};
