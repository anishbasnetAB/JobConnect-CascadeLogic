const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const jobController = require('../controllers/jobController');

// ✅ Employer creates a job
router.post('/', authMiddleware, authorizeRoles('employer'), jobController.createJob);

// ✅ Employer views their jobs
router.get('/my-jobs', authMiddleware, authorizeRoles('employer'), jobController.getMyJobs);

// ✅ Employer updates a job
router.put('/:id', authMiddleware, authorizeRoles('employer'), jobController.updateJob);

// ✅ Employer deletes a job
router.delete('/:id', authMiddleware, authorizeRoles('employer'), jobController.deleteJob);

// ✅ Employer stops applications for a job
router.patch('/:id/stop', authMiddleware, authorizeRoles('employer'), jobController.stopApplications);

// ✅ Public: get all active jobs (must come before /:jobId to avoid conflict)
router.get('/', jobController.getAllActiveJobs);

// ✅ Public: get job details by ID
router.get('/:jobId', jobController.getJobById);

module.exports = router;
