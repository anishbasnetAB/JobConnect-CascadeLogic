const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    resetPasswordToken: String,
resetPasswordExpires: Date,
  name: { type: String, required: true },
  age: Number,
  email: { type: String, required: true, unique: true },
  country: String,
  password: { type: String, required: true },
  userType: {
    type: String,
    enum: ['jobseeker', 'employer'],
    required: true,
  },
  companyCard: String, // image filename
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
