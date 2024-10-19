import {compare, hash} from '../utils/bcrypt.js';
import accountModel from '../model/account.model.js';
import RoleEnum from '../enumurator/role.enum.js';
import statusAccountEnum from '../enumurator/statusAccount.enum.js';
import {verifyCode} from '../service/verifyCodeService.js';
import {generateToken} from '../utils/jwt.js';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constant/token.js';
import {sendVerificationCode} from '../service/sendMailService.js';

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

export const login = async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({message: 'Email and password are required.'});
  }

  try {
    const account = await accountModel.findOne({where: {email}});

    if (!account) {
      return res.status(404).json({message: 'Account not found.'});
    }

    if (!account.isVerified) {
      return res.status(403).json({message: 'Account is not verified.'});
    }

    const isPasswordCorrect = await compare(account.passwordHash, password);

    if (!isPasswordCorrect) {
      return res.status(401).json({message: 'Incorrect password.'});
    }

    const accessToken = generateToken(account.id, ACCESS_TOKEN);
    const refreshToken = generateToken(account.id, REFRESH_TOKEN);

    account.token = refreshToken;
    await account.save();

    return res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(`Error during login: ${err.message}`);
    return res.status(500).json({message: 'Internal server error.'});
  }
};

export const logout = async (req, res) => {
  const {email} = req.body;

  if (!email) {
    return res.status(400).json({message: 'Email is required for logout.'});
  }

  try {
    const account = await accountModel.findOne({where: {email}});

    if (!account) {
      return res.status(404).json({message: 'Account not found.'});
    }

    account.token = null;
    account.session = null;

    await account.save();

    return res.status(200).json({message: 'Logged out successfully.'});
  } catch (err) {
    console.error(`Error during logout: ${err.message}`);
    return res.status(500).json({message: 'Internal server error.'});
  }
};

export const changeAccountInfo = async (req, res) => {
  const {name, password} = req.body;
  const {user} = req;

  try {
    const account = await accountModel.findOne({where: {id: user.id}});

    if (!account) {
      return res.status(404).json({message: 'Account not found.'});
    }

    if (name) {
      account.name = name;
    }

    if (password) {
      account.passwordHash = await hash({password});
    }

    await account.save();

    return res.status(200).json({message: 'Account information updated successfully.'});
  } catch (err) {
    console.error('Error updating account info:', err.message);
    return res.status(500).json({message: 'Internal server error.'});
  }
};
