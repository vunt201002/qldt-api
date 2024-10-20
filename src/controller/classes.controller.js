import getAll from '../helpers/getAll.js';
import ClassModel from '../model/class.model.js';

export const getAllClasses = async (req, res) => {
  try {
    const classes = await getAll({model: ClassModel});

    return res.status(200).json({
      success: true,
      message: 'Get all classes successfully',
      data: classes,
    });
  } catch (err) {
    console.error(`Error when get all class`);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
