/**
 * Scoring framework (documented for the project report).
 * The score is an AI-generated evaluation - it is NOT an official ATS score.
 * The overall score is always calculated on the server as the sum of the category scores.
 */
const CATEGORY_MAX = {
  skills: 20,
  experience: 20,
  education: 10,
  projects: 15,
  keywords: 15,
  structure: 10,
  contentQuality: 10,
};

const TOTAL_MAX = Object.values(CATEGORY_MAX).reduce((sum, value) => sum + value, 0); // 100

module.exports = { CATEGORY_MAX, TOTAL_MAX };
