const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { authMiddleware } = require('../middleware/auth');


const {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');


router.post('/signup', upload.single('companyCard'), signup);
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// router.get('/verify-email', verifyEmail);


router.get('/protected', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});


module.exports = router;