const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalFileName: { type: String, required: true, trim: true, maxlength: 255 },
  storedFileName: { type: String, required: true }, // random name inside server/uploads
  fileSize: { type: Number, required: true },
  pageCount: { type: Number, default: 1 },
  // Large field: excluded from queries unless explicitly requested with .select('+extractedText')
  extractedText: { type: String, required: true, select: false },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', resumeSchema);
