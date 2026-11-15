const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'room', required: true },
    user: { type: String, required: true },
    name: { type: String, required: true },
    text: { type: String, required: true }
}, { timestamps: true });

const message = mongoose.model('message', messageSchema);

module.exports = message;
