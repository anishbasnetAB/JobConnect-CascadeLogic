const User = require('../models/User');
const Blog = require('../models/Blog');
const Job = require('../models/Job');

// ✅ Delete employer
const deleteEmployer = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({ _id: req.params.id, userType: 'employer' });
    if (!deleted) return res.status(404).json({ message: 'Employer not found' });
    res.status(200).json({ message: 'Employer deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employer', error: err.message });
  }
};

// ✅ Delete blog
const deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Blog not found' });
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting blog', error: err.message });
  }
};

// ✅ Delete job
const deleteJob = async (req, res) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Job not found' });
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting job', error: err.message });
  }
};

// ✅ Get all jobs
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching jobs', error: err.message });
  }
};

// ✅ Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching blogs', error: err.message });
  }
};

// ✅ Get all employers
const getAllEmployers = async (req, res) => {
  try {
    const employers = await User.find({ userType: 'employer' }).sort({ createdAt: -1 });
    res.status(200).json(employers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employers', error: err.message });
  }
};

//  Export all functions
module.exports = {
  deleteEmployer,
  deleteBlog,
  deleteJob,
  getAllJobs,
  getAllBlogs,
  getAllEmployers,
};
