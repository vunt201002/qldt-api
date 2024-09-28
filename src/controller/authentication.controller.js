import {hash} from '../utils/bcrypt.js';
import accountModel from '../model/account.model.js';
import RoleEnum from '../enumurator/role.enum.js';
import statusAccountEnum from '../enumurator/statusAccount.enum.js';
import {generateVerificationCode, storeVerificationCode, verifyCode} from '../utils/crypto.js';

export const sendVerificationCode = async (account) => {
  const code = generateVerificationCode();
  storeVerificationCode(account.email, code);

  console.log(`Verification code sent to ${account.email}: ${code}`);
  return code;
};

export const verifyAccount = async (req, res) => {
  const {email, code} = req.body;

  if (!email || !code) {
    return res.status(400).json({message: 'Email and verification code are required.'});
  }

  try {
    const account = await accountModel.findOne({where: {email}});

    if (!account) {
      return res.status(404).json({message: 'Account not found.'});
    }

    const isValid = verifyCode(email, code);

    if (!isValid) {
      return res.status(400).json({message: 'Invalid or expired verification code.'});
    }

    account.isVerified = true;
    account.status = statusAccountEnum.ACTIVE;
    await account.save();

    return res.status(200).json({message: 'Account verified successfully.'});
  } catch (err) {
    console.error(`Error during verification: ${err.message}`);
    return res.status(500).json({message: 'Internal server error.'});
  }
};

export const signUp = async (req, res) => {
  try {
    const {name, email, password, role} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({message: 'Name, email, and password are required.'});
    }

    const hashPassword = await hash({password});

    const account = await accountModel.create({
      name,
      email,
      passwordHash: hashPassword,
      role: role || RoleEnum.STUDENT,
      status: statusAccountEnum.INACTIVE,
    });

    await sendVerificationCode(account);

    return res.status(201).json({
      id: account.id,
      name: account.name,
      email: account.email,
      role: account.role,
      status: account.status,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
    });
  } catch (err) {
    console.error(`Error during sign up: ${err.message}`);
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({message: 'Email already exists.'});

    return res.status(500).json({message: 'Internal server error.'});
  }
};
