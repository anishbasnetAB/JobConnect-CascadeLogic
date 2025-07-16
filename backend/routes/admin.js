const express = require('express');
const router = express.Router();

// ✅ Middleware
const { authMiddleware } = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// ✅ Controller functions
const {
  deleteEmployer,
  deleteBlog,
  deleteJob,
  getAllJobs,
  getAllBlogs,
  getAllEmployers
} = require('../controllers/adminController');

// ✅ Admin DELETE routes
router.delete('/employer/:id', authMiddleware, isAdmin, deleteEmployer);
router.delete('/blog/:id', authMiddleware, isAdmin, deleteBlog);
router.delete('/job/:id', authMiddleware, isAdmin, deleteJob);

// ✅ Admin GET routes
router.get('/jobs', authMiddleware, isAdmin, getAllJobs);
router.get('/blogs', authMiddleware, isAdmin, getAllBlogs);
router.get('/employers', authMiddleware, isAdmin, getAllEmployers);

module.exports = router;
