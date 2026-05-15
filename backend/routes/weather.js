// Weather Routes
const express = require('express');
const router = express.Router();
const { getCurrentWeather, getForecast } = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');

// Optional auth middleware - saves to history if logged in
const optionalAuth = async (req, res, next) => {
  try {
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    if (req.headers.authorization?.startsWith('Bearer')) {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId);
    }
  } catch (e) { /* no token = anonymous user, that's fine */ }
  next();
};

router.get('/current', optionalAuth, getCurrentWeather);  // GET /api/weather/current?city=...
router.get('/forecast', optionalAuth, getForecast);        // GET /api/weather/forecast?city=...

module.exports = router;
