const bcrypt = require('bcryptjs');
const user = require('../models/user.js');
const { setUser } = require('../service/auth.js');

async function signupUser(req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 4) {
        return res.render('signup', { error: "Fill all fields (password min 4 characters)" });
    }
    const exists = await user.findOne({ email: email.toLowerCase() });
    if (exists) return res.render('signup', { error: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    await user.create({ name, email: email.toLowerCase(), password: hashed });
    return res.redirect('/login');
}

async function loginUser(req, res) {
    const { email, password } = req.body;
    const User = await user.findOne({ email: (email || '').toLowerCase() });
    if (!User || !(await bcrypt.compare(password || '', User.password))) {
        return res.render('login', { error: "Invalid Email or Password" });
    }
    res.cookie('token', setUser(User), { httpOnly: true });
    return res.redirect('/');
}

function logoutUser(req, res) {
    res.clearCookie('token');
    return res.redirect('/login');
}

async function showProfile(req, res) {
    const User = await user.findById(req.user._id);
    return res.render('profile', { user: req.user, profile: User, msg: req.query.msg });
}

async function updateProfile(req, res) {
    const { name, bio } = req.body;
    const User = await user.findByIdAndUpdate(req.user._id, { name, bio }, { new: true });
    res.cookie('token', setUser(User), { httpOnly: true });
    return res.redirect('/profile?msg=Profile saved');
}

module.exports = { signupUser, loginUser, logoutUser, showProfile, updateProfile };
