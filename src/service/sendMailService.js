export const sendVerificationCode = async (account, code) => {
  console.log(`Verification code sent to ${account.email}: ${code}`);
};
