import AccountModel from '../model/account.model.js';
import statusAccountEnum from '../enumurator/statusAccount.enum.js';
import {getElementByField} from '../helpers/getElementByField.js';
import roleEnum from '../enumurator/role.enum.js';
import ClassModel from '../model/class.model.js';
import {getAllStudentClasses} from '../repositories/classes.repository.js';
import catchError from '../reponse/catchError.js';
import {OkResponse} from '../reponse/Success.js';

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
    const action = req.path.split('/')[1];
    const updateData = {
      ...req.body,
    };

    const account = await AccountModel.findOne({
      where: {
        id: id,
      },
    });

    switch (action) {
      case 'deactivated':
        updateData.status = statusAccountEnum.INACTIVE;
        break;
      case 'reactivated':
        updateData.status = statusAccountEnum.ACTIVE;
        break;
      case 'role':
        updateData.role = req.body.role;
        break;
      default:
        break;
    }

    await account.update(updateData);

    return OkResponse({
      res,
      message: 'Update account info successfully',
      data: updateData,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error when set account info',
    });
  }
};

export const getAllUserClasses = async (req, res) => {
  try {
    const {id} = req.params;

    const account = await getElementByField({
      model: AccountModel,
      field: 'id',
      value: id,
    });

    if (!account)
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });

    if (account.role === roleEnum.TEACHER) {
      const classes = await getElementByField({
        model: ClassModel,
        field: 'teacherId',
        value: account.id,
      });
      return res.status(200).json({
        success: true,
        message: 'Get class successfully.',
        data: classes,
      });
    }

    const classes = await getAllStudentClasses({id: account.id});
    return res.status(200).json({
      success: true,
      message: 'Get class successfully.',
      data: classes,
    });
  } catch (err) {
    console.error(`Error during get all user classes`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const getAccountInfo = async (req, res) => {
  try {
    const data = await getElementByField({
      model: AccountModel,
      value: req.user.id,
    });

    return OkResponse({
      res,
      data,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during get account info',
    });
  }
};
