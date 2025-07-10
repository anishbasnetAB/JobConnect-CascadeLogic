// models/Job.js
const mongoose = require('mongoose');


const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  pay: { type: String },
  location: { type: String },
  skills: [{ type: String }],
  description: { type: String },
  deadline: { type: Date },
  isActive: { type: Boolean, default: true },
  responsibilities: [{ type: String }],
  requirements: [{ type: String }],
}, { timestamps: true });


module.exports = mongoose.model('Job', jobSchema);