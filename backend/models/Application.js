model>application.js

const Application = require('../models/Application');
const Job = require('../models/Job');

// Jobseeker applies to a job
exports.applyToJob = async (req, res) => {
  try {
    const { role, experience } = req.body;
    const cvFile = req.file;

    const job = await Job.findById(req.params.jobId);
    if (!job || !job.isActive) {
      return res.status(400).json({ message: 'Job not found or closed' });
    }

    // Check if already applied
    const exists = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user.userId
    });
    if (exists) {
      return res.status(400).json({ message: 'Already applied' });
    }

    const app = new Application({
      job: req.params.jobId,
      applicant: req.user.userId,
      role,
      experience,
      cv: cvFile ? cvFile.filename : null
    });

    await app.save();

    // Increment application count
    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({ message: 'Application submitted', app });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Application failed' });
  }
};

// Employer views applicants for a job
exports.getApplicantsByJob = async (req, res) => {
  try {
    const applicants = await Application.find({ job: req.params.jobId })
      .populate('applicant', 'name email')
      .sort({ createdAt: -1 });  // newest first by default

    res.status(200).json(applicants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch applicants' });
  }
};

// Employer updates applicant status
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['applied', 'shortlisted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.appId,
      { status },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Status updated', app });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status' });
  }
};

exports.updateNote = async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.appId,
      { note: req.body.note },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json({ message: 'Note updated', app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update note' });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user.userId })
      .populate('job');
    res.status(200).json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch applications' });
  }
};