const mongoose = require('mongoose');

const score = { type: Number, required: true, min: 0 };

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true, index: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    categoryScores: {
      skills: score,
      experience: score,
      education: score,
      projects: score,
      keywords: score,
      structure: score,
      contentQuality: score,
    },
    summary: { type: String, required: true },
    skills: [String],
    strengths: [String],
    weaknesses: [String],
    missingKeywords: [String],
    recommendations: [String],
    aiModel: String, // which model produced the evaluation (useful for the report)
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

resumeAnalysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
