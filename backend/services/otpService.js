const crypto = require('crypto');
const db = require('../data/db'); // adjust import for your DB setup

const otps = {};

// Generates OTP, stores in-memory or DB for later verification
function generateOTP(email) {
  const otp = crypto.randomInt(100000, 999999).toString();
  otps[email] = { otp, expires: Date.now() + 10*60*1000 }; // stored 10 min
  return otp;
}
function verifyOTP(email, input) {
  const info = otps[email];
  if (!info || Date.now() > info.expires) return false;
  return info.otp === input;
}
module.exports = { generateOTP, verifyOTP };
