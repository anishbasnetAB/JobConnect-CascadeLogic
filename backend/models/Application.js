const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: String,
  experience: String,
  cv: String,
  status: { type: String, enum: ['applied', 'shortlisted', 'rejected'], default: 'applied' },
  note: { type: String, default: '' },
  

}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
