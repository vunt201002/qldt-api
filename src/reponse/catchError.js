import {ValidationError} from 'sequelize';

export default function catchError({res, err, message = 'Error during call api'}) {
  console.error(message, err);

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
