import {ValidationError} from 'sequelize';
import ClassModel from '../model/class.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import MaterialModel from '../model/material.model.js';
import {getFileUlr} from '../utils/file.js';
import {deleteOne} from '../helpers/deleteOne.js';
import {createOrUpdate} from '../helpers/createOrUpdate.js';
import {InvalidResponse, NotFoundResponse} from '../reponse/Error.js';
import {OkResponse} from '../reponse/Success.js';
import catchError from '../reponse/catchError.js';

export const createOrUpdateMaterial = async (req, res) => {
  try {
    const {classId, id} = req.params;
    const {title, description, type} = req.body;

    if (classId) {
      const classExists = await getElementByField({
        model: ClassModel,
        field: 'id',
        value: classId,
      });

      if (!classExists) {
        return NotFoundResponse({
          res,
          message: 'Class not found.',
        });
      }
    }

    if (id) {
      const materialExists = await getElementByField({
        model: MaterialModel,
        value: id,
      });

      if (!materialExists) {
        return NotFoundResponse({
          res,
          message: 'Material not found.',
        });
      }

      await createOrUpdate({model: MaterialModel, value: id, data: req.body});

      return OkResponse({
        res,
        message: 'Material updated successfully.',
        data: materialExists,
      });
    }

    if (!req.files || req.files.length === 0) {
      return InvalidResponse({
        res,
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

    return OkResponse({
      res,
      message: 'Materials created successfully.',
      data: materials,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during create or update material',
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
      return NotFoundResponse({
        res,
        message: 'Material not found.',
      });
    }

    const materials = await MaterialModel.findAll({
      where: {classId},
    });

    return OkResponse({
      res,
      message: 'Materials fetched successfully.',
      data: materials,
    });
  } catch (err) {
    return catchError({res, err, message: 'Error during get material'});
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
      return NotFoundResponse({
        res,
        message: 'Material not found',
      });

    return OkResponse({
      res,
      message: 'Material fetch successfully',
      data: m,
    });
  } catch (err) {
    return catchError({
      res,
      err,
      message: 'Error during get material',
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
