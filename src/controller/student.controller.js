import {createOrUpdate} from '../helpers/createOrUpdate.js';
import StudentModel from '../model/student.model.js';
import {ValidationError} from 'sequelize';

export const createOrUpdateStudent = async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;

    const resp = await createOrUpdate({
      model: StudentModel,
      field: 'id',
      value: id || '',
      data,
    });

    return res.status(200).json({
      success: true,
      message: 'Create or update student successfully',
      data: resp,
    });
  } catch (err) {
    console.error(`Error during create or update student`, err);

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
