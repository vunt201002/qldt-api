import {ValidationError} from 'sequelize';
import ClassModel from '../model/class.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import MaterialModel from '../model/material.model.js';
import {getFileUlr} from '../utils/file.js';
import {deleteOne} from '../helpers/deleteOne.js';

export const createOrUpdateMaterial = async (req, res) => {
  try {
    const {classId} = req.params;
    const {title, description, type} = req.body;

    const classExists = await getElementByField({
      model: ClassModel,
      field: 'id',
      value: classId,
    });

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: 'Class not found.',
      });
    }
    console.log(req.body, req.files);
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one file is required.',
      });
    }

    const materials = await Promise.all(
      req.files.map((file) => {
        return MaterialModel.create({
          title,
          description,
          fileUrl: getFileUlr(file.filename),
          type: type || null,
          classId,
        });
      }),
    );

    return res.status(201).json({
      success: true,
      message: 'Materials created successfully.',
      data: materials,
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

export const getClassMaterials = async (req, res) => {
  try {
    const {classId} = req.params;

    const classExists = await getElementByField({
      model: ClassModel,
      field: 'id',
      value: classId,
    });

    if (!classExists) {
      return res.status(404).json({
        success: false,
        message: 'Class not found.',
      });
    }

    const materials = await MaterialModel.findAll({
      where: {classId},
    });

    return res.status(200).json({
      success: true,
      message: 'Materials fetched successfully.',
      data: materials,
    });
  } catch (err) {
    console.error(`Error during get material`, err);

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

export const getOneMaterial = async (req, res) => {
  try {
    const {id} = req.params;

    const m = await getElementByField({
      model: MaterialModel,
      value: id,
    });

    if (!m)
      return res.status(400).json({
        success: false,
        message: 'Material not found',
      });

    return res.status(200).json({
      success: true,
      message: 'Material fetch successfully',
      data: m,
    });
  } catch (err) {
    console.error(`Error during get material`, err);

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

export const deleteMaterial = async (req, res) => {
  try {
    const {id} = req.params;

    await deleteOne({model: MaterialModel, id});

    return res.status(200).json({
      success: true,
      message: 'Delete successfully',
    });
  } catch (err) {
    console.error(`Error during get material`, err);

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
