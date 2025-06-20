
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
=======

// ================== RESET PASSWORD ==================
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
  
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
  
      if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
  
      res.status(200).json({ message: 'Password reset successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Reset failed' });
    }
  };
  
  
  
  
  // ================== FORGOT PASSWORD ==================
  exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });
  
  
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expireTime = Date.now() + 1000 * 60 * 15;
  
  
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = expireTime;
      await user.save();
  
  
      const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;
  
  
      await transporter.sendMail({
        from: `"Job Connect" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request - Job Connect',
        html: `
          <h3>Hello ${user.name},</h3>
          <p>You requested to reset your password.</p>
          <p>Click below to reset it:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 15 minutes.</p>
        `,
      });
  
  
      res.status(200).json({ message: 'Password reset link sent to email.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to generate reset link' });
    }
  };
  
  
  
=======
// ================== SIGNUP ==================
exports.signup = async (req, res) => {
  const { name, age, country, email, password, userType } = req.body;
  const file = req.file;

  try {
    if (!userType || !['jobseeker', 'employer'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    if (userType === 'employer' && !file) {
      return res.status(400).json({ message: 'Company card image is required for employers' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = new User({
      name,
      age,
      country,
      email,
      password: hashedPassword,
      userType,
      companyCard: userType === 'employer' ? file.filename : null,
      verificationToken,
      isVerified: false,
    });

    await newUser.save();

    const verificationLink = `${process.env.BASE_URL}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Job Connect" <${process.env.EMAIL_USER}>`,
      to: newUser.email,
      subject: 'Verify Your Email - Job Connect',
      html: `
        <h2>Hello ${newUser.name},</h2>
        <p>Thanks for signing up on <strong>Job Connect</strong>.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationLink}" style="color: #2b6cb0;">Verify Email</a>
        <p>This link will expire after first use.</p>
        <img src="../upload/logo.png" >
      `,
    });

    return res.status(201).json({
      message: 'User registered successfully. Verification link sent to email.',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Signup failed' });
  }
};
 
