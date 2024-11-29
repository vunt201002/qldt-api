export const ErrorResponse = ({res, statusCode = 400, errorCode = 9999, message = 'Error!'}) => {
  return res.status(statusCode).json({
    code: errorCode,
    message: message,
    data: null,
  });
};

export const InternalServerError = ({
  res,
  errorCode = 9999,
  statusCode = 500,
  message = 'Internal server error.',
}) => {
  return ErrorResponse({res, statusCode, errorCode, message});
};

export const ExistedResponse = ({res, statusCode = 400, errorCode = 9996, message = 'Existed'}) => {
  return ErrorResponse({res, message, errorCode, statusCode});
};

export const NotFoundResponse = ({
  res,
  statusCode = 404,
  errorCode = 9995,
  message = 'Not Found',
}) => {
  return ErrorResponse({res, message, statusCode, errorCode});
};

export const IncorrectDataResponse = ({
  res,
  statusCode = 400,
  errorCode = 9993,
  message = 'Incorrect',
}) => {
  return ErrorResponse({res, message, errorCode, statusCode});
};

export const NoDataResponse = ({res, statusCode = 400, errorCode = 9994, message = 'No data'}) => {
  return ErrorResponse({res, message, errorCode, statusCode});
};

export const InvalidResponse = ({res, statusCode = 400, errorCode = 9997, message = 'Invalid'}) => {
  return ErrorResponse({res, message, errorCode, statusCode});
};

export const CannotConnectToDb = ({
  res,
  errorCode = 1001,
  statusCode = 500,
  message = 'Error connect to db',
}) => {
  return ErrorResponse({res, statusCode, errorCode, message});
};

export const NotEnoughParams = ({
  res,
  errorCode = 1002,
  statusCode = 400,
  message = 'Not enough params',
}) => {
  return ErrorResponse({res, statusCode, errorCode, message});
};

export const UnknownError = ({
  res,
  errorCode = 1005,
  statusCode = 400,
  message = 'Unknown error',
}) => {
  return ErrorResponse({res, statusCode, errorCode, message});
};

export const OverFileSize = ({
  res,
  errorCode = 1006,
  statusCode = 400,
  message = 'File size is too big',
}) => {
  return ErrorResponse({res, statusCode, errorCode, message});
};

export const UploadFailed = ({
  res,
  errorCode = 1007,
  statusCode = 400,
  message = 'Upload failed',
}) => {
  return ErrorResponse({res, statusCode, errorCode, message});
};

export const ForbiddenResponse = ({
  res,
  errorCode = 1009,
  statusCode = 403,
  message = 'Forbidden',
}) => {
  return ErrorResponse({res, statusCode, errorCode, message});
};

export const ActionHasBeenDone = ({
  res,
  errorCode = 1010,
  statusCode = 400,
  message = 'Action has been done',
}) => {
  return ErrorResponse({res, statusCode, errorCode, message});
};
