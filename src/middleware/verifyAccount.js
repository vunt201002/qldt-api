import {getAccountByField} from '../repositories/account.repository.js';
import {isEmail} from '../utils/email.js';

export const verifyAccountExists = async (req, res, next) => {
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      });
    }

    if (!isEmail(email))
      return res.status(400).json({
        success: false,
        message: 'Email is not correct.',
      });

    const account = await getAccountByField({value: email});

    if (!account)
      return res.status(404).json({
        success: false,
        message: 'Account not found',
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
