import {createOrUpdate} from '../helpers/createOrUpdate.js';
import TeacherModel from '../model/teacher.model.js';
import {ValidationError} from 'sequelize';
import AccountModel from '../model/account.model.js';
import roleEnum from '../enumurator/role.enum.js';

export const createOrUpdateTeacher = async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;
    const {accountId} = data;

    const account = await AccountModel.findOne({
      where: {
        id: accountId,
      },
    });

    if (!account) {
      return res.status(400).json({
        success: false,
        message: 'Account not exist',
      });
    }

    if (account.role !== roleEnum.TEACHER) {
      return res.status(400).json({
        success: false,
        message: 'Not a teacher account',
      });
    }

    const resp = await createOrUpdate({
      model: TeacherModel,
      field: 'id',
      value: id || '',
      data,
    });

    return res.status(200).json({
      success: true,
      message: 'Create or update teacher successfully',
      data: resp,
    });
  } catch (err) {
    console.error(`Error during create or update teacher`, err);

    if (err instanceof ValidationError) {
      const errorMessages = err.errors.map((error) => error.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessages,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
