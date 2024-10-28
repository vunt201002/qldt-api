import {ValidationError} from 'sequelize';
import ClassModel from '../model/class.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import MaterialModel from '../model/material.model.js';
import {getFileUlr} from '../utils/file.js';

export const createOrUpdateMaterial = async (req, res) => {
  try {
    const {classId} = req.params;
    const data = req.body;

    const classExists = await getElementByField({
      model: ClassModel,
      value: classId || '',
    });
    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: 'Class not found.',
      });
    }
    console.log({data}, 'adfasd');
    const newMaterial = await MaterialModel.create({
      ...data,
      fileUrl: req.file ? getFileUlr(req.file.filename) : null,
      classId,
    });

    return res.status(201).json({
      success: true,
      message: 'Material created successfully.',
      data: newMaterial,
    });
  } catch (err) {
    console.error(`Error during create or update material`, err);

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
