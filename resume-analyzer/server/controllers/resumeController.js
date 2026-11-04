const Resume = require('../models/Resume');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { processPdf } = require('../services/pdfService');
const { filePathFor, removeFileQuietly, deleteResumeCompletely } = require('../services/resumeService');

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Please choose a PDF file to upload.', 400);

  try {
    const { text, pageCount } = await processPdf(filePathFor(req.file.filename));
    const resume = await Resume.create({
      userId: req.user._id,
      originalFileName: req.file.originalname.slice(0, 255),
      storedFileName: req.file.filename,
      fileSize: req.file.size,
      pageCount,
      extractedText: text,
    });
    const { extractedText, ...safeResume } = resume.toObject();
    res.status(201).json({ success: true, resume: safeResume });
  } catch (error) {
    await removeFileQuietly(req.file.filename); // never keep a file that failed validation
    throw error;
  }
});

const listResumes = asyncHandler(async (req, res) => {
  const resumes = await Resume.find({ userId: req.user._id }).sort({ uploadedAt: -1 });
  res.json({ success: true, count: resumes.length, resumes });
});

const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) throw new AppError('Resume not found.', 404);
  res.json({ success: true, resume });
});

const deleteResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
  if (!resume) throw new AppError('Resume not found.', 404);
  await deleteResumeCompletely(resume);
  res.json({ success: true, message: 'Resume and its analyses were deleted.' });
});

module.exports = { uploadResume, listResumes, getResume, deleteResume };
