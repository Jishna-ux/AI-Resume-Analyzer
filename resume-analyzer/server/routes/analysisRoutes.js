const router = require('express').Router();
const { createAnalysis, getAnalysis, getHistory, deleteAnalysis } = require('../controllers/analysisController');
const { protect, authorize } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/validate');

router.use(protect, authorize('user'));

// "/history" must be declared before "/:id", otherwise "history" would be treated as an id.
router.get('/history', getHistory);
router.post('/:resumeId', validateObjectId('resumeId'), createAnalysis);
router.get('/:id', validateObjectId(), getAnalysis);
router.delete('/:id', validateObjectId(), deleteAnalysis);

module.exports = router;
