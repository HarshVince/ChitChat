const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['public', 'private'], default: 'public' },
    code: { type: String, required: true, unique: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    ownerName: String,
    notes: { type: String, default: '' },
    files: [{
        filename: String,     
        path: String,         
        uploadedBy: String,  
        uploadedAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

const room = mongoose.model('room', roomSchema);

module.exports = room;
