import bcrypt from 'bcrypt';

export const genSalts = async (saltRounds) => {
  try {
    return await bcrypt.genSalt(saltRounds);
  } catch (err) {
    console.log('Error when generating salt:', err);
    return '';
  }
};

export const hash = async ({password, salt, saltRounds}) => {
  try {
    const saltGen = salt || (await bcrypt.genSalt(saltRounds || 10));
    return await bcrypt.hash(password, saltGen);
  } catch (err) {
    console.log('Error when hashing password:', err);
    return '';
  }
};

export const compare = async (store, input) => {
  try {
    const result = await bcrypt.compare(input, store);

    if (!result) {
      console.log('Wrong password');
      return false;
    }

    console.log('Password match');
    return true;
  } catch (err) {
    console.log('Error when comparing password:', err);
    return false;
  }
};
