const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { signToken } = require('../utils/token');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  if (await User.findOne({ email: normalizedEmail })) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // The role is never read from the request: public registration always creates a candidate.
  const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
  res.status(201).json({ success: true, token: signToken(user._id), user });
});

const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email.trim().toLowerCase() }).select('+password');

  // Same message for "no such user" and "wrong password" so accounts cannot be enumerated.
  if (!user || !(await user.matchPassword(req.body.password))) {
    throw new AppError('Invalid email or password.', 401);
  }
  if (!user.isActive) throw new AppError('Your account has been disabled. Contact the administrator.', 403);

  res.json({ success: true, token: signToken(user._id), user });
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = { register, login, getMe };
