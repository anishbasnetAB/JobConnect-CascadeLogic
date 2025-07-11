const User = require('../models/User');
const Job = require('../models/Job');

// 📌 Helper: Validate job existence and status
const validateJob = async (jobId) => {
  const job = await Job.findById(jobId);
  if (!job || !job.isActive) return null;
  return job;
};

// ✅ Save a job
exports.saveJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await validateJob(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    const user = await User.findById(req.user.userId);

    const alreadySaved = user.savedJobs.includes(jobId);
    if (alreadySaved) {
      return res.status(400).json({ message: 'Job already saved' });
    }

    user.savedJobs.push(jobId);
    await user.save();

    return res.status(200).json({ message: 'Job saved successfully' });
  } catch (error) {
    console.error('Error saving job:', error);
    return res.status(500).json({ message: 'Failed to save job' });
  }
};

// ❌ Unsave a job
exports.unsaveJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const user = await User.findById(req.user.userId);

    user.savedJobs = user.savedJobs.filter(
      (savedId) => savedId.toString() !== jobId
    );

    await user.save();

    return res.status(200).json({ message: 'Job removed from saved list' });
  } catch (error) {
    console.error('Error unsaving job:', error);
    return res.status(500).json({ message: 'Failed to unsave job' });
  }
};

// 📥 Get saved jobs
exports.getSavedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('savedJobs');

    return res.status(200).json(user.savedJobs);
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return res.status(500).json({ message: 'Failed to fetch saved jobs' });
  }
};

