// middleware/auth.js

const User = require('../models/userAuthorModel');

/**
 * Middleware to check if a user has permanent admin privileges
 * @param {string} email - Email of the user to check
 * @returns {boolean} - True if user is a permanent admin, false otherwise
 */
const isPermanentAdmin = async (email) => {
  try {
    if (!email) {
      return false;
    }
    
    // Find the user by email
    const user = await User.findOne({ email });
    
    // Check if user exists and has permanent admin role
    if (!user) {
      return false;
    }
    
    return user.role === 'PERMANENT_ADMIN';
  } catch (error) {
    console.error('Error in isPermanentAdmin middleware:', error);
    return false;
  }
};

module.exports = {
  isPermanentAdmin,
  // You can add other auth middleware functions here
};