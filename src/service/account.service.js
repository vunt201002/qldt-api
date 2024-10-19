import AccountModel from '../model/account.model.js';

export const getAccountByField = async ({field = 'email', value}) => {
  return await AccountModel.findOne({
    where: {[field]: value},
  });
};
