const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { jwtSecret } = require('../config/env');

// Authentication: who is making the request?
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new AppError('Authentication required. Please log in.', 401);

  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    throw new AppError('Your session is invalid or has expired. Please log in again.', 401);
  }

  // Load the user on every request so a disabled account loses access immediately.
  const user = await User.findById(payload.id);
  if (!user) throw new AppError('Your session is invalid. Please log in again.', 401);
  if (!user.isActive) throw new AppError('Your account has been disabled. Contact the administrator.', 403);

  req.user = user;
  next();
});

// Authorization: is this user allowed to do this?
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError('You do not have permission to access this resource.', 403));
  }
  return next();
};

module.exports = { protect, authorize };
