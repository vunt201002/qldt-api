import AccountModel from '../model/account.model.js';

export const getAllAccounts = async (req, res) => {
  try {
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

export const setAccountInfo = async (req, res) => {
  try {
    const {id} = req.params;
    const setData = req.body;

    const account = await AccountModel.findOne({
      where: {
        id: id,
      },
    });

    await account.update(setData);

    return res.status(200).json({
      success: true,
      message: 'Update account info successfully.',
    });
  } catch (err) {
    console.error(`Error when set account info`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
