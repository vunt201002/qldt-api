import roleEnum from '../enumurator/role.enum.js';
import AccountModel from '../model/account.model.js';

export const getAllAccounts = async (req, res) => {
  try {
    const {user} = req;

    if (user.role !== roleEnum.ADMIN)
      return res.status(403).json({
        success: false,
        message: 'You are not access to do this',
      });

    const accounts = await AccountModel.findAll();
    return res.status(200).json({
      success: true,
      data: accounts,
    });
  } catch (err) {
    console.error(`Error when get all account`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
