const express = require('express');
const { showHome } = require('../controllers/room.js');
const { showProfile } = require('../controllers/user.js');
const { restrictToLoggedinUsers } = require('../middlewares/auth.js');
const router = express.Router();

router.get('/', restrictToLoggedinUsers, showHome);
router.get('/profile', restrictToLoggedinUsers, showProfile);
router.get('/login', (req, res) => res.render('login', { error: null }));
router.get('/signup', (req, res) => res.render('signup', { error: null }));

module.exports = router;
