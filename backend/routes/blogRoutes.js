const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/auth');
const upload = require('../utils/upload');
const blogController = require('../controllers/blogController');

// Create blog (employer only)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('employer'),
  upload.array('images', 5),
  blogController.createBlog
);

router.post(
  '/:blogId/like',
  authMiddleware,
  authorizeRoles('jobseeker', 'employer'), // ✅ allow both
  blogController.likeBlog
);

router.post(
  '/:blogId/comment',
  authMiddleware,
  authorizeRoles('jobseeker', 'employer'), // ✅ allow both
  blogController.commentBlog
);
// Get all blogs
router.get('/', blogController.getBlogs);

router.post('/:blogId/like', authMiddleware, authorizeRoles('jobseeker'), blogController.likeBlog);
router.post('/:blogId/comment', authMiddleware, authorizeRoles('jobseeker'), blogController.commentBlog);


router.get('/:blogId', blogController.getBlogById);

module.exports = router;
