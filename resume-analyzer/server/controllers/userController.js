const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  if (name !== undefined) user.name = name.trim();

  if (newPassword !== undefined) {
    if (!(await user.matchPassword(currentPassword))) {
      throw new AppError('Current password is incorrect.', 400);
    }
    user.password = newPassword; // hashed by the model's pre-save hook
  }

  await user.save();
  res.json({ success: true, message: 'Profile updated.', user });
});

module.exports = { getProfile, updateProfile };
