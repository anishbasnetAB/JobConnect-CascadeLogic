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
  
  
  