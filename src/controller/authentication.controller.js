import {compare, hash} from '../utils/bcrypt.js';
import accountModel from '../model/account.model.js';
import RoleEnum from '../enumurator/role.enum.js';
import statusAccountEnum from '../enumurator/statusAccount.enum.js';
import {getVerifyCode, verifyCode} from '../service/verifyCodeService.js';
import {generateToken} from '../utils/jwt.js';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constant/token.js';

export const verifyAccount = async (req, res) => {
  const {code} = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: 'Verification code is required.',
    });
  }

  try {
    let {user} = req;

    const isValid = verifyCode(user.id, code);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification code.',
      });
    }

    user.isVerified = true;
    user.status = statusAccountEnum.ACTIVE;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Account verified successfully.',
    });
  } catch (err) {
    console.error(`Error during verification: ${err.message}`);
    return res.status(500).json({message: 'Internal server error.'});
  }
};

export const signUp = async (req, res) => {
  try {
    const {name, email, password, role} = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    const hashPassword = await hash({password});

    const account = await accountModel.create({
      name,
      email,
      passwordHash: hashPassword,
      role: role || RoleEnum.STUDENT,
      status: statusAccountEnum.INACTIVE,
    });

    const code = await getVerifyCode(account);

    return res.status(201).json({
      success: true,
      account: {
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
        verificationCode: code,
        status: account.status,
        createdAt: account.createdAt,
        updatedAt: account.updatedAt,
      },
    });
  } catch (err) {
    console.error(`Error during sign up: ${err.message}`);
    if (err.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({
        success: false,
        message: 'Email already exists.',
      });

    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export const login = async (req, res) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  try {
    const {user} = req;

    if (!user.isVerified)
      return res.status(404).json({
        success: false,
        message: 'Account is not verified',
      });

    const isPasswordCorrect = await compare(user.passwordHash, password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password.',
      });
    }

    const accessToken = generateToken({id: user.id, role: user.role}, ACCESS_TOKEN);
    const refreshToken = generateToken({id: user.id, role: user.role}, REFRESH_TOKEN);

    user.token = refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
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
  try {
    const {name, password} = req.body;
    const {user} = req;

    const account = await accountModel.findOne({
      where: {
        id: user.id,
      },
    });
    if (name) {
      account.name = name;
    }

    if (password) {
      account.passwordHash = await hash({password});
    }

    await account.save();

    return res.status(200).json({
      success: true,
      message: 'Account information updated successfully.',
    });
  } catch (err) {
    console.error('Error updating account info:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export const getAccountVerifyCode = async (req, res) => {
  try {
    const {user} = req;
    const code = await getVerifyCode(user);

    if (!code) return res.status(404).json({success: false, message: 'Account already verified'});

    return res.status(200).json({
      code,
      success: true,
      message: 'Get verify code successfully',
    });
  } catch (err) {
    console.error(`Error during get verify code for account`, err);
    return res.status(500).json({success: false, message: 'Internal server error'});
  }
};
