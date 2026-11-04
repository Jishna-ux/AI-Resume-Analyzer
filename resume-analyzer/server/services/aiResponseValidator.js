const AppError = require('../utils/AppError');
const { CATEGORY_MAX } = require('../utils/scoring');

const invalid = () => new AppError('The AI returned an incomplete or invalid analysis. Please try again.', 502);

const toStringList = (value, { maxItems = 10, maxLength = 200 } = {}) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => typeof item === 'string')
    .map((item) => item.replace(/\s+/g, ' ').trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
};

/**
 * Treats the AI output as untrusted data: checks the shape, clamps every score to its
 * allowed range, limits text length, and recalculates the overall score itself.
 * Nothing from the AI is ever executed or rendered as HTML.
 */
function validateAnalysis(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw invalid();

  const categoryScores = {};
  for (const [category, max] of Object.entries(CATEGORY_MAX)) {
    const value = raw.categoryScores && raw.categoryScores[category];
    if (typeof value !== 'number' || !Number.isFinite(value)) throw invalid();
    categoryScores[category] = Math.min(max, Math.max(0, Math.round(value)));
  }

  const summary = typeof raw.summary === 'string' ? raw.summary.replace(/\s+/g, ' ').trim().slice(0, 1200) : '';
  const recommendations = toStringList(raw.recommendations);
  if (!summary || recommendations.length === 0) throw invalid();

  return {
    overallScore: Object.values(categoryScores).reduce((sum, value) => sum + value, 0),
    categoryScores,
    summary,
    skills: toStringList(raw.skills, { maxItems: 25, maxLength: 60 }),
    strengths: toStringList(raw.strengths),
    weaknesses: toStringList(raw.weaknesses),
    missingKeywords: toStringList(raw.missingKeywords, { maxItems: 15, maxLength: 60 }),
    recommendations,
  };
}

module.exports = { validateAnalysis };
