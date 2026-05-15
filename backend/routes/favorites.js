// Favorites Routes
const express = require('express');
const router = express.Router();
const { getFavorites, addFavorite, removeFavorite, updatePreferences } = require('../controllers/favoritesController');
const { protect } = require('../middleware/auth');

// All favorites routes require authentication
router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.delete('/:cityName', protect, removeFavorite);
router.put('/preferences', protect, updatePreferences);

module.exports = router;
