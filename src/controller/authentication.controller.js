import {compare, hash} from '../utils/bcrypt.js';
import accountModel from '../model/account.model.js';
import AccountModel from '../model/account.model.js';
import RoleEnum from '../enumurator/role.enum.js';
import statusAccountEnum from '../enumurator/statusAccount.enum.js';
import {getVerifyCode, verifyCode} from '../service/verifyCodeService.js';
import {generateToken} from '../utils/jwt.js';
import {ACCESS_TOKEN, REFRESH_TOKEN} from '../constant/token.js';
import {isEmail} from '../utils/email.js';
import catchError from '../reponse/catchError.js';
import {OkResponse} from '../reponse/Success.js';
import {
  ActionHasBeenDone,
  ExistedResponse,
  IncorrectDataResponse,
  InvalidResponse,
  NotEnoughParams,
} from '../reponse/Error.js';
import {getElementByField} from '../helpers/getElementByField.js';

export const verifyAccount = async (req, res) => {
  try {
    const {code} = req.body;

    if (!code)
      return NotEnoughParams({
        res,
        message: 'Verification code is required.',
      });

    let {user} = req;

    const isValid = verifyCode(user.id, code);

    if (!isValid)
      return InvalidResponse({
        res,
        message: 'Invalid or expired verification code.',
      });

    user.isVerified = true;
    user.status = statusAccountEnum.ACTIVE;
    await user.save();

    return OkResponse({
      res,
      message: 'Account verified successfully.',
    });
  } catch (err) {
    return catchError({res, err, message: 'Error during verification'});
  }
};

export const signUp = async (req, res) => {
  try {
    const {name, email, password, role} = req.body;

    if (!name || !email || !password)
      return NotEnoughParams({
        res,
        message: 'Name, email, and password are required.',
      });

    if (!isEmail(email))
      return InvalidResponse({
        res,
        message: 'Invalid email format.',
      });

    if (password.length < 6 || password.length > 10)
      return InvalidResponse({
        res,
        message: 'Password must be between 6 to 10 characters.',
      });

    const accountExisted = await getElementByField({
      model: AccountModel,
      field: 'email',
      value: email,
    });

    if (accountExisted)
      return ExistedResponse({
        res,
        message: 'User existed',
      });

    const hashPassword = await hash({password});

    const {dataValues: account} = await accountModel.create({
      name,
      email,
      passwordHash: hashPassword,
      role: role || RoleEnum.STUDENT,
      status: statusAccountEnum.INACTIVE,
      passwordChangeRequired: true,
    });

    const code = await getVerifyCode(account);

    return OkResponse({
      res,
      data: {
        ...account,
        verificationCode: code,
      },
    });
  } catch (err) {
    return catchError({res, err, message: 'Error during sign up'});
  }
};

export const login = async (req, res) => {
  const {password} = req.body;

  try {
    const {user} = req;

    if (!password)
      return NotEnoughParams({
        res,
        message: 'Password is required',
      });

    if (!user.isVerified)
      return InvalidResponse({
        res,
        message: 'Account is not verified',
      });

    const isPasswordCorrect = await compare(user.passwordHash, password);

    if (!isPasswordCorrect)
      return IncorrectDataResponse({
        res,
        message: 'Incorrect password.',
      });

    const accessToken = generateToken({id: user.id, role: user.role}, ACCESS_TOKEN);
    const refreshToken = generateToken({id: user.id, role: user.role}, REFRESH_TOKEN);

    user.token = refreshToken;
    await user.save();

    return OkResponse({
      res,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during login',
    });
  }
};

export const logout = async (req, res) => {
  try {
    const {email} = req.user;
    const account = await accountModel.findOne({where: {email}});

    account.token = null;
    account.session = null;

    await account.save();

    return OkResponse({res, message: 'Logged out successfully.'});
  } catch (err) {
    return catchError({res, err, message: 'Logged out successfully.'});
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

    account.passwordChangeRequired = false;
    await account.save();

    return OkResponse({
      res,
      message: 'Account information updated successfully.',
    });
  } catch (err) {
    return catchError({res, err, message: 'Error updating account info'});
  }
};

export const getAccountVerifyCode = async (req, res) => {
  try {
    const {user} = req;
    const code = await getVerifyCode(user);

    if (!code)
      return ActionHasBeenDone({res, message: 'Account already verified or you reach your limit'});

    return OkResponse({
      res,
      message: 'Get verify code successfully',
      data: {verifyCode: code},
    });
  } catch (err) {
    return catchError({res, err, message: 'Error during get verify code for account'});
  }
};
