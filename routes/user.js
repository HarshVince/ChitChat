const express = require('express');
const { signupUser, loginUser, logoutUser, updateProfile } = require('../controllers/user.js');
const { restrictToLoggedinUsers } = require('../middlewares/auth.js');
const router = express.Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/profile', restrictToLoggedinUsers, updateProfile);

module.exports = router;
