const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const upload = require('../utils/upload');
const applicationController = require('../controllers/applicationController');

// Jobseeker views their own applications (✅ placed above dynamic routes!)
router.get(
  '/my',
  authMiddleware,
  authorizeRoles('jobseeker'),
  applicationController.getMyApplications
);

// Jobseeker applies to a job
router.post(
  '/:jobId',
  authMiddleware,
  authorizeRoles('jobseeker'),
  upload.single('cv'),
  applicationController.applyToJob
);

// Employer views applicants for a job
router.get(
  '/:jobId',
  authMiddleware,
  authorizeRoles('employer'),
  applicationController.getApplicantsByJob
);

// Employer updates applicant status
router.patch(
  '/status/:appId',
  authMiddleware,
  authorizeRoles('employer'),
  applicationController.updateStatus
);

// Employer updates applicant note
router.patch(
  '/note/:appId',
  authMiddleware,
  authorizeRoles('employer'),
  applicationController.updateNote
);

module.exports = router;


