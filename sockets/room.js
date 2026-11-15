const room = require('../models/room.js');
const message = require('../models/message.js');
const { getUser } = require('../service/auth.js');

function parseCookie(header = '') {
    const out = {};
    header.split(';').forEach(part => {
        const i = part.indexOf('=');
        if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
    });
    return out;
}

async function sendMembers(io, code) {
    const sockets = await io.in(code).fetchSockets();
    const names = [...new Set(sockets.map(s => s.user.name))];
    io.to(code).emit('members:update', names);
}

function registerRoomSockets(io) {

    io.use((socket, next) => {
        const user = getUser(parseCookie(socket.handshake.headers.cookie).token);
        if (!user) return next(new Error('Not logged in'));
        socket.user = user;
        next();
    });

    io.on('connection', socket => {

        socket.on('room:join', async code => {
            const Room = await room.findOne({ code: String(code).toUpperCase() });
            if (!Room) return;
            socket.code = Room.code;
            socket.join(Room.code);
            const old = await message.find({ room: Room._id }).sort({ createdAt: -1 }).limit(50);
            socket.emit('room:init', {
                messages: old.reverse().map(m => ({ uid: m.user, name: m.name, text: m.text, time: m.createdAt }))
            });
            sendMembers(io, Room.code);
        });

        socket.on('chat:send', async text => {
            if (!socket.code) return;
            text = String(text || '').trim().slice(0, 500);
            if (!text) return;
            const Room = await room.findOne({ code: socket.code });
            const m = await message.create({ room: Room._id, user: socket.user._id, name: socket.user.name, text });
            io.to(socket.code).emit('chat:new', { uid: m.user, name: m.name, text: m.text, time: m.createdAt });
        });

        socket.on('chat:clear', async () => {
            if (!socket.code) return;
            const Room = await room.findOne({ code: socket.code });
            await message.deleteMany({ room: Room._id });
            io.to(socket.code).emit('chat:cleared');
        });

        socket.on('disconnect', () => {
            if (socket.code) sendMembers(io, socket.code);
        });

    });
}

module.exports = { registerRoomSockets };
