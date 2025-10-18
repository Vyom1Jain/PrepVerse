// JWT Authentication Implementation for PrepVerse
// Secure user authentication with bcrypt password hashing and JWT tokens

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Environment variables (set in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '7d';
const SALT_ROUNDS = 10;

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User data and JWT token
 */
async function registerUser(userData) {
  const { email, password, username } = userData;
  
  try {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [email, username]
    );
    
    if (existingUser.rows.length > 0) {
      throw new Error('User with this email or username already exists');
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    
    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, username, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING id, email, username, created_at`,
      [email, passwordHash, username]
    );
    
    const user = result.rows[0];
    
    // Create default user settings
    await pool.query(
      `INSERT INTO user_settings (user_id, theme, notification_enabled, created_at)
       VALUES ($1, 'light', TRUE, NOW())`,
      [user.id]
    );
    
    // Generate JWT token
    const token = generateToken(user);
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.created_at
      },
      token
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}

/**
 * Login existing user
 * @param {Object} credentials - Login credentials
 * @returns {Object} User data and JWT token
 */
async function loginUser(credentials) {
  const { email, password } = credentials;
  
  try {
    // Find user by email
    const result = await pool.query(
      'SELECT id, email, username, password_hash, created_at FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Invalid email or password');
    }
    
    const user = result.rows[0];
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }
    
    // Update last login time
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );
    
    // Generate JWT token
    const token = generateToken(user);
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.created_at
      },
      token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

/**
 * Generate JWT token
 * @param {Object} user - User data
 * @returns {String} JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username
  };
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION
  });
}

/**
 * Verify JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Middleware to protect routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
async function authenticateToken(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Check if user still exists
    const result = await pool.query(
      'SELECT id, email, username FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Attach user to request
    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
}

/**
 * Refresh JWT token
 * @param {String} token - Current JWT token
 * @returns {String} New JWT token
 */
async function refreshToken(token) {
  try {
    const decoded = verifyToken(token);
    
    // Fetch fresh user data
    const result = await pool.query(
      'SELECT id, email, username FROM users WHERE id = $1',
      [decoded.id]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = result.rows[0];
    return generateToken(user);
  } catch (error) {
    throw new Error('Token refresh failed');
  }
}

/**
 * Change user password
 * @param {Number} userId - User ID
 * @param {String} oldPassword - Current password
 * @param {String} newPassword - New password
 * @returns {Boolean} Success status
 */
async function changePassword(userId, oldPassword, newPassword) {
  try {
    // Get current password hash
    const result = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const currentHash = result.rows[0].password_hash;
    
    // Verify old password
    const isValid = await bcrypt.compare(oldPassword, currentHash);
    
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }
    
    // Hash new password
    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    
    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, userId]
    );
    
    return true;
  } catch (error) {
    console.error('Password change error:', error);
    throw error;
  }
}

module.exports = {
  registerUser,
  loginUser,
  generateToken,
  verifyToken,
  authenticateToken,
  refreshToken,
  changePassword
};
