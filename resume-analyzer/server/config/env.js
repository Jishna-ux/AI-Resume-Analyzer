const path = require('path');
const { ai } = require('../config/env');

// The single .env file lives in the project root (see .env.example).
require('dotenv').config({ path: path.resolve(__dirname, '../../.env'), quiet: true });


const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill them in.`);
  process.exit(1);
}
if (!process.env.AI_API_KEY) {
  console.warn('Warning: AI_API_KEY is not set. Login works, but resume analysis will fail until it is added to .env.');
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  ai: {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
    maxInputChars: Number(process.env.AI_MAX_INPUT_CHARS) || 30000,
    timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 60000,
  },
  //ai: {
    //apiKey: process.env.AI_API_KEY,
    //apiUrl: process.env.AI_API_URL || 'https://api.anthropic.com/v1/messages',
    //model: process.env.AI_MODEL || 'claude-sonnet-5-5',
    //timeoutMs: Number(process.env.AI_TIMEOUT_MS) || 60000,
    //maxInputChars: 12000, // resume text sent to the AI is truncated to this length
  //},
  upload: {
    dir: path.resolve(__dirname, '../uploads'),
    maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB) || 5,
  },
};
