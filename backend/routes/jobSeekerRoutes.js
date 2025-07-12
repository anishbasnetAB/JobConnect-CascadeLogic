const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const jobSeekerController = require('../controllers/jobSeekerController');

// Save job
router.post('/save/:jobId', authMiddleware, authorizeRoles('jobseeker'), jobSeekerController.saveJob);

// Unsave job
router.delete('/save/:jobId', authMiddleware, authorizeRoles('jobseeker'), jobSeekerController.unsaveJob);

// Get saved jobs
router.get('/saved', authMiddleware, authorizeRoles('jobseeker'), jobSeekerController.getSavedJobs);

module.exports = router;
