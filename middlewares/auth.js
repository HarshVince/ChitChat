const { getUser } = require('../service/auth.js');

function checkAuth(req, res, next) {
    req.user = getUser(req.cookies?.token);
    next();
}

function restrictToLoggedinUsers(req, res, next) {
    const user = getUser(req.cookies?.token);
    if (!user) return res.redirect('/login');
    req.user = user;
    next();
}

module.exports = { checkAuth, restrictToLoggedinUsers };
