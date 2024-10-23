import {createOrUpdate} from '../helpers/createOrUpdate.js';
import AssignmentModel from '../model/assignment.model.js';
import {getElementByField} from '../helpers/getElementByField.js';
import getAll from '../helpers/getAll.js';
import {deleteOne} from '../helpers/deleteOne.js';

export const getAssignment = async (req, res) => {
  try {
    const {id} = req.params;

    if (id) {
      const assignment = await getElementByField({
        model: AssignmentModel,
        field: 'id',
        value: id,
      });

      if (!assignment)
        return res.status(200).json({
          success: false,
          message: 'Assignment not found',
          data: assignment,
        });

      return res.status(200).json({
        success: true,
        message: 'Get assignment successfully',
        data: assignment,
      });
    }

    const assignments = await getAll({model: AssignmentModel});

    return res.status(200).json({
      success: true,
      message: 'Get assignment successfully',
      data: assignments,
    });
  } catch (err) {
    console.error(`Error when get assigment`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const {id} = req.params;

    const resp = await deleteOne({model: AssignmentModel, id});

    if (!resp)
      return res.status(200).json({
        success: false,
        message: 'Assignment not found',
      });

    return res.status(200).json({
      success: true,
      message: 'Delete assignment successfully',
      data: resp,
    });
  } catch (err) {
    console.error(`Error during delete assignment`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};

export const createOrUpdateAssignment = async (req, res) => {
  try {
    const {id, title, description, deadline, status, maxScore, teacherId, classId} = req.body;

    const response = await createOrUpdate({
      model: AssignmentModel,
      field: 'id',
      value: id || '',
      data: {
        ...(title && {title}),
        ...(description && {description}),
        ...(status && {status}),
        ...(maxScore && {maxScore}),
        ...(teacherId && {teacherId}),
        ...(classId && {classId}),
        ...(deadline && {deadline: new Date(deadline)}),
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Create assignment successfully',
      data: response.data,
    });
  } catch (err) {
    console.error(`Error when create assigment`, err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
