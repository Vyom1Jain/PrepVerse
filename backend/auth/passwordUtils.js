/**
 * Password Utility Functions
 * TODO: Implement password hashing and validation utilities
 * 
 * This module should provide:
 * - Password hashing using bcrypt
 * - Password comparison and verification
 * - Password strength validation
 */

const bcrypt = require('bcryptjs');

/**
 * TODO: Hash a plain text password
 * @param {string} password - Plain text password to hash
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Error hashing password: ' + error.message);
  }
};

/**
 * TODO: Compare plain text password with hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} True if passwords match
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Error comparing passwords: ' + error.message);
  }
};

/**
 * TODO: Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
const validatePasswordStrength = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long`
    };
  }

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      isValid: false,
      message: 'Password must contain uppercase, lowercase, and numbers'
    };
  }

  return {
    isValid: true,
    message: 'Password is strong'
  };
};

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength
};
