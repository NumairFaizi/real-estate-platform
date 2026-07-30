const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadImages } = require('../controllers/uploadController');
const protect = require('../middleware/auth');

router.post('/', protect, upload.array('images', 6), uploadImages);

module.exports = router;