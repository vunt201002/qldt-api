import getAll from '../helpers/getAll.js';
import ClassModel from '../model/class.model.js';
import getElementFields from '../helpers/getElementFields.js';
import {getElementByField} from '../helpers/getElementByField.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import sequelize from '../database/connect.js';
import {ValidationError} from 'sequelize';

export const getAllClasses = async (req, res) => {
  try {
    const classes = await getAll({model: ClassModel});

    return res.status(200).json({
      success: true,
      message: 'Get all classes successfully',
      data: classes,
    });
  } catch (err) {
    console.error(`Error when get all class`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getOneClass = async (req, res) => {
  try {
    const {id} = req.params;

    const classElement = await getElementByField({
      model: ClassModel,
      field: 'id',
      value: id,
    });

    if (!classElement)
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });

    return res.status(200).json({
      success: true,
      message: 'Get class successfully.',
      data: classElement,
    });
  } catch (err) {
    console.error(`Error during get one class`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getClassSchedule = async (req, res) => {
  try {
    const {id} = req.params;

    const resp = await ClassModel.findOne({
      where: {
        id: id,
      },
      attributes: ['schedule'],
    });

    return res.status(200).json({
      success: true,
      message: 'Get class schedule successfully',
      data: JSON.parse(resp.schedule),
    });
  } catch (err) {
    console.error(`Error during get class schedule`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const createOrUpdateClass = async (req, res) => {
  try {
    const {id} = req.params;
    const {studentIds, ...rest} = req.body;
    const resp = await createOrUpdate({
      model: ClassModel,
      field: 'id',
      value: id || '',
      data: rest,
    });

    if (studentIds && Array.isArray(studentIds)) {
      const classInstance = await getElementByField({
        model: ClassModel,
        field: 'id',
        value: resp.data.id,
      });
      if (classInstance) {
        await classInstance.addStudents(studentIds);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Create or update class successfully',
      data: resp,
    });
  } catch (err) {
    console.error(`Error during create or update class`, err);

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

export const deleteClass = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {id} = req.params;

    const classInstance = await getElementByField({
      model: ClassModel,
      field: 'id',
      value: id,
    });

    if (!classInstance) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    await classInstance.removeStudents(await classInstance.getStudents());
    await classInstance.destroy();

    await transaction.commit();

    return res.status(200).json({
      success: true,
      message: 'Class deleted successfully',
    });
  } catch (err) {
    console.error(`Error during delete class`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
