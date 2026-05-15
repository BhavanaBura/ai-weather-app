// ============================================
// Favorites Controller - Manage Saved Cities
// ============================================

const User = require('../models/User');

// ---- GET ALL FAVORITES ----
// GET /api/favorites
const getFavorites = async (req, res) => {
  try {
    // Include totalSearchCount so the frontend can show accurate lifetime search count
    const user = await User.findById(req.user._id).select('favoriteCities recentSearches totalSearchCount');
    res.json({
      success: true,
      favorites: user.favoriteCities,
      recentSearches: user.recentSearches,
      totalSearchCount: user.totalSearchCount || 0  // lifetime total, not capped at 10
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

// ---- ADD CITY TO FAVORITES ----
// POST /api/favorites
const addFavorite = async (req, res) => {
  try {
    const { cityName, country, lat, lon } = req.body;

    if (!cityName) {
      return res.status(400).json({ message: 'City name is required' });
    }

    const user = await User.findById(req.user._id);

    // Check if city already in favorites
    const alreadyExists = user.favoriteCities.some(
      city => city.cityName.toLowerCase() === cityName.toLowerCase()
    );

    if (alreadyExists) {
      return res.status(400).json({ message: 'City is already in your favorites!' });
    }

    user.favoriteCities.push({ cityName, country, lat, lon });
    await user.save();

    res.json({ success: true, message: `${cityName} added to favorites! ⭐`, favorites: user.favoriteCities });

  } catch (error) {
    res.status(500).json({ message: 'Error adding favorite' });
  }
};

// ---- REMOVE CITY FROM FAVORITES ----
// DELETE /api/favorites/:cityName
const removeFavorite = async (req, res) => {
  try {
    const { cityName } = req.params;

    const user = await User.findById(req.user._id);
    user.favoriteCities = user.favoriteCities.filter(
      city => city.cityName.toLowerCase() !== cityName.toLowerCase()
    );
    await user.save();

    res.json({ success: true, message: `${cityName} removed from favorites`, favorites: user.favoriteCities });

  } catch (error) {
    res.status(500).json({ message: 'Error removing favorite' });
  }
};

// ---- UPDATE USER PREFERENCES ----
// PUT /api/favorites/preferences
const updatePreferences = async (req, res) => {
  try {
    const { darkMode, temperatureUnit } = req.body;
    const user = await User.findById(req.user._id);

    if (darkMode !== undefined) user.preferences.darkMode = darkMode;
    if (temperatureUnit) user.preferences.temperatureUnit = temperatureUnit;

    await user.save();
    res.json({ success: true, preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: 'Error updating preferences' });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite, updatePreferences };
