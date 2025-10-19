const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateOTP, verifyOTP } = require('../services/otpService');
const { sendOTP } = require('../services/emailService');
const db = require('../data/db');
const router = express.Router();

// Sign up (request)
router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const exists = await db.users.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const otp = generateOTP(email);
  await sendOTP(email, otp);
  res.json({ success: true });
});
// Verify OTP and create account
router.post('/verify', async (req, res) => {
  const { email, otp, password } = req.body;
  if (!verifyOTP(email, otp)) return res.status(400).json({ message: 'Invalid OTP' });
  const hash = await bcrypt.hash(password, 10);
  await db.users.insertOne({ email, password: hash, role: email === "vyom1jain@gmail.com" ? "admin" : "user" });
  res.json({ success: true });
});
// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findOne({ email });
  if (!user) return res.status(400).json({ message: 'No such user' });
  if (!await bcrypt.compare(password, user.password)) return res.status(400).json({ message: 'Wrong password' });
  const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2d' });
  res.json({ token, role: user.role });
});
// Forgot password: send OTP
router.post('/forgot', async (req, res) => {
  const { email } = req.body;
  const user = await db.users.findOne({ email });
  if (!user) return res.status(400).json({ message: 'No such user' });
  const otp = generateOTP(email);
  await sendOTP(email, otp);
  res.json({ success: true });
});
// Reset password with OTP
router.post('/reset', async (req, res) => {
  const { email, otp, password } = req.body;
  if (!verifyOTP(email, otp)) return res.status(400).json({ message: 'Invalid OTP' });
  const hash = await bcrypt.hash(password, 10);
  await db.users.updateOne({ email }, { $set: { password: hash } });
  res.json({ success: true });
});

module.exports = router;
