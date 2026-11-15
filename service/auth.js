const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || '$%663@22$5**^33i33%';

function setUser(user) {
    return jwt.sign({ _id: user._id, name: user.name, email: user.email }, secret, { expiresIn: '7d' });
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secret);
    } catch (err) {
        return null;
    }
}

module.exports = { setUser, getUser };
