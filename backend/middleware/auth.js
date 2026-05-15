// ============================================
// Auth Middleware - Protects Private Routes
// ============================================
// This middleware checks if the user has a valid JWT token
// before allowing access to protected routes

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    // Token format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]; // Get just the token part
    }

    // If no token found, deny access
    if (!token) {
      return res.status(401).json({ message: 'Not authorized. Please login first.' });
    }

    // Verify the token is valid and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user from the token's user ID
    const user = await User.findById(decoded.userId).select('-password'); // Exclude password

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    // Attach user to the request object so routes can access it
    req.user = user;
    next(); // Continue to the next middleware or route handler

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please login again.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    res.status(500).json({ message: 'Server error in authentication' });
  }
};

module.exports = { protect };
