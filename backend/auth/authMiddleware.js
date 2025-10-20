/**
 * Authentication Middleware
 * TODO: Implement authentication middleware for protected routes
 * 
 * This middleware should:
 * - Verify JWT tokens from request headers
 * - Decode and validate user credentials
 * - Attach user information to request object
 * - Handle authentication errors appropriately
 */

const jwt = require('jsonwebtoken');

/**
 * TODO: Implement authenticateToken middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authenticateToken = (req, res, next) => {
  // TODO: Extract token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  // TODO: Verify token with JWT_SECRET from environment variables
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

/**
 * TODO: Implement role-based access control middleware
 * @param {Array} allowedRoles - Array of roles allowed to access the route
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // TODO: Check if user role is in allowedRoles array
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access forbidden' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};
