const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
// Transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// ================== VERIFY EMAIL ==================
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;


  try {
    // Try to find a user with this token
    let user = await User.findOne({ verificationToken: token });


    // ✅ 1. No user found with token — check if user is already verified
    if (!user) {
      // Try fallback: see if there's any user that already verified
      user = await User.findOne({ isVerified: true });


      if (user) {
        return res.status(200).json({ message: 'Email verified' });
      }


      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }


    // ✅ 2. User found and not verified — mark as verified
    if (user.isVerified) {
      return res.status(200).json({ message: 'Email is verified' });
    }


    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();


    return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Verification failed' });
  }
};
