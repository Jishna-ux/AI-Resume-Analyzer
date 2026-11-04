const User = require('../models/User');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const countsByUser = (Model, userIds) =>
  Model.aggregate([{ $match: { userId: { $in: userIds } } }, { $group: { _id: '$userId', count: { $sum: 1 } } }]);

const listUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const filter = {};
  if (typeof req.query.search === 'string' && req.query.search.trim()) {
    const pattern = new RegExp(escapeRegex(req.query.search.trim().slice(0, 60)), 'i');
    filter.$or = [{ name: pattern }, { email: pattern }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);

  const ids = users.map((user) => user._id);
  const [resumeCounts, analysisCounts] = await Promise.all([countsByUser(Resume, ids), countsByUser(ResumeAnalysis, ids)]);
  const lookup = (rows) => new Map(rows.map((row) => [String(row._id), row.count]));
  const resumes = lookup(resumeCounts);
  const analyses = lookup(analysisCounts);

  res.json({
    success: true,
    page,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    total,
    users: users.map((user) => ({
      ...user.toJSON(),
      resumeCount: resumes.get(String(user._id)) || 0,
      analysisCount: analyses.get(String(user._id)) || 0,
    })),
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  if (String(req.user._id) === req.params.id) {
    throw new AppError('You cannot change the status of your own account.', 400);
  }
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found.', 404);

  user.isActive = req.body.isActive;
  await user.save();
  res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'disabled'}.`, user });
});

// Statistics only: no resume text or file content is ever returned to the admin.
const getStatistics = asyncHandler(async (req, res) => {
  const [totalUsers, activeUsers, totalResumes, totalAnalyses, averageRow, distribution, recent] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Resume.countDocuments(),
    ResumeAnalysis.countDocuments(),
    ResumeAnalysis.aggregate([{ $group: { _id: null, average: { $avg: '$overallScore' } } }]),
    ResumeAnalysis.aggregate([
      { $bucket: { groupBy: '$overallScore', boundaries: [0, 40, 60, 80, 101], default: 'other', output: { count: { $sum: 1 } } } },
    ]),
    ResumeAnalysis.find().sort({ createdAt: -1 }).limit(8).select('userId overallScore createdAt').populate('userId', 'name email'),
  ]);

  const labels = { 0: '0-39', 40: '40-59', 60: '60-79', 80: '80-100' };
  const scoreDistribution = Object.entries(labels).map(([start, label]) => ({
    range: label,
    count: (distribution.find((row) => row._id === Number(start)) || {}).count || 0,
  }));

  res.json({
    success: true,
    statistics: {
      totalUsers,
      activeUsers,
      totalResumes,
      totalAnalyses,
      averageScore: averageRow.length ? Math.round(averageRow[0].average * 10) / 10 : 0,
      scoreDistribution,
      recentActivity: recent.map((item) => ({
        id: item._id,
        user: item.userId ? { name: item.userId.name, email: item.userId.email } : null,
        overallScore: item.overallScore,
        createdAt: item.createdAt,
      })),
    },
  });
});

module.exports = { listUsers, updateUserStatus, getStatistics };
