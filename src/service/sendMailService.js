import {generateVerificationCode, storeVerificationCode} from './verifyCodeService.js';

export const sendVerificationCode = async (account) => {
  const code = generateVerificationCode();
  storeVerificationCode(account.email, code);

  console.log(`Verification code sent to ${account.email}: ${code}`);
  return code;
};
