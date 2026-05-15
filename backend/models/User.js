// ============================================
// User Model - Defines how user data is stored
// ============================================
// Mongoose schema defines the shape of documents in MongoDB

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // User's display name
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true, // Removes whitespace from both ends
    minlength: [2, 'Name must be at least 2 characters']
  },

  // User's email (must be unique)
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true, // Store emails in lowercase
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] // Basic email validation
  },

  // User's hashed password (never store plain text passwords!)
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },

  // List of cities the user saved as favorites
  favoriteCities: [{
    cityName: String,
    country: String,
    lat: Number,
    lon: Number,
    addedAt: { type: Date, default: Date.now }
  }],

  // Recent cities the user searched for
  recentSearches: [{
    cityName: String,
    country: String,
    searchedAt: { type: Date, default: Date.now }
  }],

  // Total searches counter (lifetime, never resets unlike recentSearches which caps at 10)
  totalSearchCount: { type: Number, default: 0 },

  // User preferences
  preferences: {
    temperatureUnit: { type: String, default: 'celsius', enum: ['celsius', 'fahrenheit'] },
    darkMode: { type: Boolean, default: false }
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// ---- PASSWORD HASHING ----
// This runs automatically BEFORE saving a user to the database
userSchema.pre('save', async function(next) {
  // Only hash the password if it was changed (or is new)
  if (!this.isModified('password')) return next();

  // Hash the password with a "salt rounds" of 12 (higher = more secure but slower)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ---- INSTANCE METHOD ----
// This method can be called on any user document to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
