const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');


// Example: Only employers can post jobs
router.post('/post', authMiddleware, authorizeRoles('employer'), (req, res) => {
  res.status(200).json({ message: 'Job posted successfully' });
});


// Example: Only jobseekers can apply
router.post('/apply', authMiddleware, authorizeRoles('jobseeker'), (req, res) => {
  res.status(200).json({ message: 'Applied to job successfully' });
});


module.exports = router;