import {createOrUpdate} from '../helpers/createOrUpdate.js';
import TeacherModel from '../model/teacher.model.js';

export const createOrUpdateTeacher = async (req, res) => {
  try {
    const {id} = req.params;
    const data = req.body;

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
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
