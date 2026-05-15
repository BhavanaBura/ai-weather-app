// ============================================
// AI Weather Dashboard - Main Server File
// ============================================
// This is the entry point of our backend application.
// It sets up Express, connects to MongoDB, and registers all routes.

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// ---- MIDDLEWARE SETUP ----
// These run on every request before reaching your routes

// Allow requests from your frontend
app.use(cors({
  origin: "https://ai-weather-app-ztsa.vercel.app",
  credentials: true
}));
// Parse incoming JSON data
app.use(express.json());

// Rate limiting - prevents abuse (max 100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ---- IMPORT ROUTES ----
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const aiRoutes = require('./routes/ai');
const favoritesRoutes = require('./routes/favorites');

// ---- REGISTER ROUTES ----
// All API endpoints start with /api/
app.use('/api/auth', authRoutes);       // /api/auth/register, /api/auth/login
app.use('/api/weather', weatherRoutes); // /api/weather/current, /api/weather/forecast
app.use('/api/ai', aiRoutes);           // /api/ai/insights
app.use('/api/favorites', favoritesRoutes); // /api/favorites

// ---- HEALTH CHECK ----
app.get('/', (req, res) => {
  res.json({ message: '🌤️ AI Weather Dashboard API is running!', status: 'OK' });
});

// ---- CONNECT TO MONGODB ----
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    // Start the server only after DB connection is established
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit if database connection fails
  });
