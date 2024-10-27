import {createOrUpdate} from '../helpers/createOrUpdate.js';
import StudentModel from '../model/student.model.js';

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
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
