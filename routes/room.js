const express = require('express');
const multer = require('multer');
const path = require('path');
const { createRoom, joinRoom, showRoom, uploadFile, deleteFile } = require('../controllers/room.js');
const router = express.Router();

const storage = multer.diskStorage({
    destination: 'public/uploads/',
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e5);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10 MB max

router.post('/', createRoom);
router.post('/join', joinRoom);
router.get('/:code', showRoom);
router.post('/:code/upload', upload.single('file'), uploadFile);
router.post('/:code/delete/:fileId', deleteFile);

module.exports = router;
