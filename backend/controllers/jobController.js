const Job = require('../models/Job');
const redis = require('../redisClient');

exports.createJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      skills: req.body.skills || [],
      responsibilities: req.body.responsibilities || [],
      requirements: req.body.requirements || [],
      employer: req.user.userId,
    });
    await job.save();
    await redis.del('jobs:active'); // Invalidate cache
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Job creation failed' });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.userId });
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const updatedFields = {
      ...req.body,
    };
    if (req.body.skills) {
      updatedFields.skills = req.body.skills;
    }
    if (req.body.responsibilities) {
      updatedFields.responsibilities = req.body.responsibilities;
    }
    if (req.body.requirements) {
      updatedFields.requirements = req.body.requirements;
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user.userId },
      updatedFields,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await redis.del('jobs:active'); // Invalidate cache
    res.status(200).json({ message: 'Job updated successfully', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Job update failed' });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user.userId });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await redis.del('jobs:active'); // Invalidate cache
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Job deletion failed' });
  }
};

exports.stopApplications = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user.userId },
      { isActive: false },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });

    await redis.del('jobs:active'); // Invalidate cache
    res.status(200).json({ message: 'Applications stopped', job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to stop applications' });
  }
};

exports.getAllActiveJobs = async (req, res) => {
  const cacheKey = 'jobs:active';

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log('Serving from Redis cache');
      return res.status(200).json(JSON.parse(cached));
    }

    const jobs = await Job.find({ isActive: true });

    await redis.set(cacheKey, JSON.stringify(jobs), 'EX', 60); // cache for 60 seconds
    console.log('Serving from MongoDB');

    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch active jobs' });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch job details' });
  }
};
