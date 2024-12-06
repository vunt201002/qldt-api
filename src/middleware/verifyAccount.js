import {getAccountByField} from '../repositories/account.repository.js';
import {isEmail} from '../utils/email.js';
import {InvalidResponse, NotEnoughParams, NotFoundResponse} from '../reponse/Error.js';

export const verifyAccountExists = async (req, res, next) => {
  try {
    const {email} = req.body;

    if (!email)
      return NotEnoughParams({
        res,
        message: 'Email is required.',
      });

    if (!isEmail(email))
      return InvalidResponse({
        res,
        errorCode: 1004,
        message: 'Invalid email format.',
      });

    const account = await getAccountByField({value: email});

    if (!account)
      return NotFoundResponse({
        res,
        message: 'User not found',
      });

    req.user = account;
    next();
  } catch (err) {
    console.error(`Error during verify account exist`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
