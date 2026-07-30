const express = require('express');
const router = express.Router();
const {
  registerUser, loginUser, getMe, addFavorite, removeFavorite, getFavorites,
} = require('../controllers/authController');
const protect = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.post('/favorites/:propertyId', protect, addFavorite);
router.delete('/favorites/:propertyId', protect, removeFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;