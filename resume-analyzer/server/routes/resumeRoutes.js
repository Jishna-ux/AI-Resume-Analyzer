const router = require('express').Router();
const { uploadResume, listResumes, getResume, deleteResume } = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validate');
const { uploadResume: handleUpload } = require('../middleware/upload');

router.use(protect, authorize('user'));
router.post('/upload', handleUpload, uploadResume);
router.get('/', listResumes);
router.get('/:id', validateObjectId(), getResume);
router.delete('/:id', validateObjectId(), deleteResume);

module.exports = router;
