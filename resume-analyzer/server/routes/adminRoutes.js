const router = require('express').Router();
const { listUsers, updateUserStatus, getStatistics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { validateBody, validateObjectId } = require('../middleware/validate');

router.use(protect, authorize('admin'));
router.get('/users', listUsers);
router.put('/users/:id/status', validateObjectId(), validateBody('userStatus'), updateUserStatus);
router.get('/statistics', getStatistics);

module.exports = router;
