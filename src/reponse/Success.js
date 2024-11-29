export const OkResponse = ({res, message = 'Success!', data = null}) => {
  return res.status(200).json({
    code: 1000,
    message: message,
    data: data,
  });
};
