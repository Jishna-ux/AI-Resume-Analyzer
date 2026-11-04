const router = require('express').Router();
const { getProfile, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');

router.use(protect);
router.get('/profile', getProfile);
router.put('/profile', validateBody('profile'), updateProfile);

module.exports = router;
