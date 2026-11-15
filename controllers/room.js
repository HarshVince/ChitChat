const fs = require('fs');
const room = require('../models/room.js');

function makeCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
}

async function showHome(req, res) {
    const publicRooms = await room.find({ type: 'public' }).sort({ createdAt: -1 }).limit(30);
    const myRooms = await room.find({ owner: req.user._id }).sort({ createdAt: -1 });
    return res.render('home', { user: req.user, publicRooms, myRooms, error: req.query.error });
}

async function createRoom(req, res) {
    const { name, type } = req.body;
    if (!name) return res.redirect('/?error=Enter a room name');
    const Room = await room.create({
        name, type: type === 'private' ? 'private' : 'public',
        code: makeCode(), owner: req.user._id, ownerName: req.user.name
    });
    return res.redirect('/room/' + Room.code);
}

async function joinRoom(req, res) {
    const code = (req.body.code || '').trim().toUpperCase();
    const Room = await room.findOne({ code });
    if (!Room) return res.redirect('/?error=No room found with that code');
    return res.redirect('/room/' + Room.code);
}

async function showRoom(req, res) {
    const Room = await room.findOne({ code: req.params.code.toUpperCase() });
    if (!Room) return res.redirect('/?error=Room not found');
    return res.render('room', { user: req.user, room: Room });
}

async function uploadFile(req, res) {
    if (!req.file) return res.redirect('back');
    const Room = await room.findOne({ code: req.params.code.toUpperCase() });
    if (!Room) return res.redirect('/');
    Room.files.push({
        filename: req.file.originalname,
        path: '/uploads/' + req.file.filename,
        uploadedBy: req.user.name
    });
    await Room.save();
    return res.redirect('/room/' + Room.code + '#files');
}

async function deleteFile(req, res) {
    const Room = await room.findOne({ code: req.params.code.toUpperCase() });
    if (!Room) return res.redirect('/');
    const file = Room.files.id(req.params.fileId);
    if (file) {
        const diskPath = 'public' + file.path;
        if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
        file.deleteOne();
        await Room.save();
    }
    return res.redirect('/room/' + Room.code + '#files');
}

async function deleteRoom(req, res) {
    const Room = await room.findOne({ code: req.params.code.toUpperCase() });
    if (!Room) return res.redirect('/');
    if (String(Room.owner) !== String(req.user._id)) return res.redirect('/room/' + Room.code);
   
    for (const file of Room.files) {
        const diskPath = 'public' + file.path;
        if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
    }
    await room.deleteOne({ _id: Room._id });
    return res.redirect('/');
}

module.exports = { showHome, createRoom, joinRoom, showRoom, uploadFile, deleteFile, deleteRoom };
