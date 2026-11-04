const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const config = require('./config/env'); // loads .env first
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();

app.use(helmet());
app.use(cors({ origin: config.clientUrl }));
app.use(express.json({ limit: '100kb' }));

const limiter = (windowMinutes, max, message) =>
  rateLimit({ windowMs: windowMinutes * 60 * 1000, limit: max, standardHeaders: true, legacyHeaders: false, message: { success: false, message } });

app.use('/api', limiter(15, 300, 'Too many requests. Please slow down.'));
app.use('/api/auth/login', limiter(15, 20, 'Too many login attempts. Try again in 15 minutes.'));
app.use('/api/auth/register', limiter(60, 20, 'Too many registrations from this address. Try again later.'));
// AI calls cost money, so analysis requests get their own stricter limit (created once, so counts persist).
const analysisLimiter = limiter(60, 30, 'Analysis limit reached. Try again in an hour.');
app.use('/api/analysis', (req, res, next) => (req.method === 'POST' ? analysisLimiter(req, res, next) : next()));

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/resumes', require('./routes/resumeRoutes'));
app.use('/api/analysis', require('./routes/analysisRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(config.port, () => console.log(`Server running on http://localhost:${config.port} (${config.nodeEnv})`));
};

process.on('unhandledRejection', (reason) => console.error('Unhandled rejection:', reason));

if (require.main === module) start();

module.exports = app;
