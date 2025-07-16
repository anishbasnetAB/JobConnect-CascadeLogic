const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// ✅ Allowed extensions and MIME types for CVs
const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png'];

// File filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedMimeTypes.includes(mime) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF or image files (jpg, jpeg, png) are allowed for CV uploads'), false);
  }
};

// ✅ Limit file size to 2MB
const limits = {
  fileSize: 2 * 1024 * 1024 // 2 MB
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;