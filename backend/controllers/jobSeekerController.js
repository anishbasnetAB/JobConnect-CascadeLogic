const User = require('../models/User');
const Job = require('../models/Job');

// Save a job
exports.saveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    // Check if job exists and is active
    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    const user = await User.findById(req.user.userId);
    if (user.savedJobs.includes(jobId)) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.savedJobs.push(jobId);
    await user.save();

    res.status(200).json({ message: 'Job saved successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save job' });
  }
};

// Unsave a job
exports.unsaveJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const user = await User.findById(req.user.userId);
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
    await user.save();

    res.status(200).json({ message: 'Job removed from saved list' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to unsave job' });
  }
};

// Get saved jobs
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('savedJobs');
    res.status(200).json(user.savedJobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch saved jobs' });
  }
};