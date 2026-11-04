const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const AppError = require('../utils/AppError');
const { upload: uploadConfig } = require('../config/env');

fs.mkdirSync(uploadConfig.dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadConfig.dir),
  // Never use the client's filename on disk - a random name prevents path tricks and collisions.
  filename: (req, file, cb) => cb(null, `${crypto.randomUUID()}.pdf`),
});

// First-line check (MIME type + extension). The real content check (magic bytes) happens in pdfService.
const fileFilter = (req, file, cb) => {
  const isPdf = file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf';
  if (!isPdf) return cb(new AppError('Only PDF files are allowed.', 400));
  return cb(null, true);
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: { fileSize: uploadConfig.maxFileSizeMb * 1024 * 1024, files: 1 },
}).single('resume');

module.exports = { uploadResume };
