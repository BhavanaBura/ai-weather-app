// AI Routes
const express = require('express');
const router = express.Router();
const { getWeatherInsights } = require('../controllers/aiController');

router.post('/insights', getWeatherInsights);  // POST /api/ai/insights

module.exports = router;
