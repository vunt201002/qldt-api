import {ValidationError} from 'sequelize';
import {IncorrectDataResponse, InternalServerError} from './Error.js';

export default function catchError({res, err, message = 'Error during call api'}) {
  console.error(message, err);

  if (err instanceof ValidationError) {
    const errorMessages = err.errors.map((error) => error.message);
    return IncorrectDataResponse({res, message: `Validation error - ${errorMessages}`});
  }

  return InternalServerError({res, message: 'Internal server error'});
}
