// Scoring framework - must match server/utils/scoring.js
export const CATEGORIES = [
  { key: 'skills', label: 'Skills', max: 20, hint: 'Breadth, depth and relevance of your skills' },
  { key: 'experience', label: 'Work experience', max: 20, hint: 'Relevance, responsibilities and measurable impact' },
  { key: 'education', label: 'Education', max: 10, hint: 'Degrees, institutions and completeness' },
  { key: 'projects', label: 'Projects', max: 15, hint: 'Quality, technologies used and outcomes' },
  { key: 'keywords', label: 'Keywords', max: 15, hint: 'Industry-standard terms and tools' },
  { key: 'structure', label: 'Structure', max: 10, hint: 'Sections, ordering, length and consistency' },
  { key: 'contentQuality', label: 'Content quality', max: 10, hint: 'Clarity, action verbs and grammar' },
];

export const MAX_FILE_SIZE_MB = 5; // keep in sync with MAX_FILE_SIZE_MB on the server
export const SCORE_DISCLAIMER =
  'This is an AI-generated evaluation score based on the framework above. It is not an official ATS score and does not predict hiring outcomes.';
