import {createOrUpdate} from '../helpers/createOrUpdate.js';
import TeacherModel from '../model/teacher.model.js';
import {ValidationError} from 'sequelize';
import AccountModel from '../model/account.model.js';
import roleEnum from '../enumurator/role.enum.js';
import {IncorrectDataResponse, NotFoundResponse} from '../reponse/Error.js';
import {OkResponse} from '../reponse/Success.js';
import catchError from '../reponse/catchError.js';

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

    if (!account)
      return NotFoundResponse({
        res,
        message: 'Account not exist',
      });

    if (account.role !== roleEnum.TEACHER)
      return IncorrectDataResponse({
        res,
        message: 'Not a teacher account',
      });

    const {data: resp} = await createOrUpdate({
      model: TeacherModel,
      field: 'id',
      value: id || '',
      data,
    });

    return OkResponse({
      res,
      data: resp,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during create or update teacher',
    });
  }
};
