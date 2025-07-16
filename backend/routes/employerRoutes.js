// backend/routes/employerRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const employerController = require('../controllers/employerController');

router.get('/dashboard-stats', authMiddleware, authorizeRoles('employer'), employerController.getEmployerStats);

module.exports = router;
