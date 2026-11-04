const mongoose = require('mongoose');
const AppError = require('../utils/AppError');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isString = (value) => typeof value === 'string';

function passwordErrors(password, label = 'Password') {
  if (!isString(password) || password.length < 8 || password.length > 72) {
    return [`${label} must be between 8 and 72 characters.`];
  }
  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return [`${label} must contain at least one letter and one number.`];
  }
  return [];
}

const validName = (name) => isString(name) && name.trim().length >= 2 && name.trim().length <= 60;

// Each rule returns a list of error messages (empty list = valid).
// Checking typeof === 'string' also blocks NoSQL operator injection such as { "$ne": "" }.
const rules = {
  register: (body) => {
    const errors = [];
    if (!validName(body.name)) errors.push('Name must be between 2 and 60 characters.');
    if (!isString(body.email) || !EMAIL_PATTERN.test(body.email.trim())) errors.push('Enter a valid email address.');
    errors.push(...passwordErrors(body.password));
    return errors;
  },
  login: (body) => {
    const errors = [];
    if (!isString(body.email) || !body.email.trim()) errors.push('Email is required.');
    if (!isString(body.password) || !body.password) errors.push('Password is required.');
    return errors;
  },
  profile: (body) => {
    const errors = [];
    if (body.name !== undefined && !validName(body.name)) errors.push('Name must be between 2 and 60 characters.');
    if (body.newPassword !== undefined) {
      if (!isString(body.currentPassword) || !body.currentPassword) {
        errors.push('Current password is required to set a new password.');
      }
      errors.push(...passwordErrors(body.newPassword, 'New password'));
    }
    return errors;
  },
  userStatus: (body) => (typeof body.isActive === 'boolean' ? [] : ['isActive must be true or false.']),
};

const validateBody = (ruleName) => (req, res, next) => {
  const errors = rules[ruleName](req.body || {});
  if (errors.length > 0) return next(new AppError(errors[0], 400, errors));
  return next();
};

const validateObjectId = (paramName = 'id') => (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params[paramName])) {
    return next(new AppError('Invalid identifier supplied.', 400));
  }
  return next();
};

module.exports = { validateBody, validateObjectId };
