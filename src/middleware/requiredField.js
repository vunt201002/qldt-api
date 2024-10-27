import {getModelRequiredField} from '../helpers/getModelRequiredField.js';

export const requiredField = (model) => {
  return (req, res, next) => {
    const requiredFields = getModelRequiredField(model);

    const missingFields = requiredFields.filter(
      (field) => !req.body[field] && req.body[field] !== 0, // allow 0 as valid input
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    next();
  };
};
