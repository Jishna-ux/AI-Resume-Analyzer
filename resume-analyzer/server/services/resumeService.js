const fs = require('fs/promises');
const path = require('path');
const Resume = require('../models/Resume');
const ResumeAnalysis = require('../models/ResumeAnalysis');
const { upload } = require('../config/env');

const filePathFor = (storedFileName) => path.join(upload.dir, path.basename(storedFileName));

async function removeFileQuietly(storedFileName) {
  try {
    await fs.unlink(filePathFor(storedFileName));
  } catch (error) {
    if (error.code !== 'ENOENT') console.error('Could not delete file:', error.message);
  }
}

// Removes the stored PDF, the extracted text and every analysis that belongs to the resume.
async function deleteResumeCompletely(resume) {
  await ResumeAnalysis.deleteMany({ resumeId: resume._id });
  await removeFileQuietly(resume.storedFileName);
  await Resume.deleteOne({ _id: resume._id });
}

module.exports = { filePathFor, removeFileQuietly, deleteResumeCompletely };
