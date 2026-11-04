const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const analysisService = require('../services/analysisService');
const { deleteResumeCompletely } = require('../services/resumeService');

const populateResume = { path: 'resumeId', select: 'originalFileName uploadedAt pageCount' };

const createAnalysis = asyncHandler(async (req, res) => {
  const analysis = await analysisService.createAnalysis(req.user._id, req.params.resumeId);
  await analysis.populate(populateResume);
  res.status(201).json({ success: true, analysis });
});

const getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, userId: req.user._id }).populate(populateResume);
  if (!analysis) throw new AppError('Analysis not found.', 404);
  res.json({ success: true, analysis });
});

const getHistory = asyncHandler(async (req, res) => {
  const analyses = await ResumeAnalysis.find({ userId: req.user._id })
    .select('resumeId overallScore categoryScores createdAt')
    .sort({ createdAt: -1 })
    .populate(populateResume);
  res.json({ success: true, count: analyses.length, analyses });
});

// Deleting an analysis also removes the uploaded PDF and its text once nothing else uses it.
const deleteAnalysis = asyncHandler(async (req, res) => {
  const analysis = await ResumeAnalysis.findOne({ _id: req.params.id, userId: req.user._id });
  if (!analysis) throw new AppError('Analysis not found.', 404);

  await analysis.deleteOne();

  const remaining = await ResumeAnalysis.countDocuments({ resumeId: analysis.resumeId });
  if (remaining === 0) {
    const resume = await Resume.findById(analysis.resumeId);
    if (resume) await deleteResumeCompletely(resume);
  }
  res.json({ success: true, message: 'Analysis deleted.' });
});

module.exports = { createAnalysis, getAnalysis, getHistory, deleteAnalysis };
