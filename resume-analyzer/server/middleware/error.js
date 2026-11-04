const AppError = require('../utils/AppError');

const notFound = (req, res, next) => next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));

// Converts any error into a safe JSON response. Stack traces are logged on the server, never sent.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;
  let details = err.details;

  if (err.name === 'MulterError') {
    statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message = err.code === 'LIMIT_FILE_SIZE' ? 'The file is too large. Please upload a smaller PDF.' : 'Invalid file upload. Send one PDF in the "resume" field.';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    details = Object.values(err.errors).map((e) => e.message);
    message = details[0];
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier supplied.';
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists.';
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Request body contains invalid JSON.';
  } else if (!err.isOperational) {
    console.error(err.stack || err);
    statusCode = 500;
    message = 'Something went wrong on our side. Please try again later.';
    details = undefined;
  }

  res.status(statusCode).json({ success: false, message, ...(details ? { errors: details } : {}) });
};

module.exports = { notFound, errorHandler };
