const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const AppError = require('../utils/AppError');
const aiService = require('./aiService');

// Flow: load resume text -> AI service (call + validate) -> save to MongoDB.
async function createAnalysis(userId, resumeId) {
  const resume = await Resume.findOne({ _id: resumeId, userId }).select('+extractedText');
  if (!resume) throw new AppError('Resume not found.', 404);

  const result = await aiService.analyzeResume(resume.extractedText);

  return ResumeAnalysis.create({ userId, resumeId: resume._id, ...result });
}

module.exports = { createAnalysis };
