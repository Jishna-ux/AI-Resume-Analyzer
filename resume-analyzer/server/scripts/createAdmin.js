// Usage: npm run seed:admin   (reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD from .env)
// Admins cannot register through the public form, so this script creates (or promotes) one.
const mongoose = require('mongoose');
require('../config/env');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = process.env.ADMIN_NAME || 'Administrator';

  if (!email || password.length < 8) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (min 8 characters) in .env first.');
    process.exit(1);
  }

  await connectDB();
  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    existing.isActive = true;
    await existing.save();
    console.log(`Existing user ${email} is now an admin.`);
  } else {
    await User.create({ name, email, password, role: 'admin' });
    console.log(`Admin ${email} created.`);
  }
  await mongoose.disconnect();
})();
