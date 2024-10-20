import AccountModel from '../model/account.model.js';

export const getAccountByField = async ({field = 'email', value}) => {
  return await AccountModel.findOne({
    where: {[field]: value},
  });
};

export const createOrUpdateAccount = async ({data}) => {
  const {email, ...updateData} = data;

  let account = await getAccountByField({value: email});

  if (account) {
    await account.update(updateData);
    return {
      success: true,
      message: 'Account updated successfully.',
      account,
    };
  }

  account = await AccountModel.create(updateData);
  return {
    success: true,
    message: 'Account created successfully',
    account,
  };
};
