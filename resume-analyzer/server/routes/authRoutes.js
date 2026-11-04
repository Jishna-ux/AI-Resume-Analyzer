const router = require('express').Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');

router.post('/register', validateBody('register'), register);
router.post('/login', validateBody('login'), login);
router.get('/me', protect, getMe);

module.exports = router;
