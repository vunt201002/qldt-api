import {hash} from '../utils/bcrypt.js';
import accountModel from '../model/account.model.js';

export const signUp = async (req, res) => {
  try {
    const {email, password, role} = req.body;
    const hashPassword = await hash({password});
    const account = await accountModel.create({email, password: hashPassword, role});
    return res.status(200).json(account);
  } catch (err) {
    console.log(`Error when sign up`, err);
  }
};
