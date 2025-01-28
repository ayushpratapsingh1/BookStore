const router = require('express').Router();
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories
const dirs = ['./uploads', './uploads/pdfs', './uploads/covers'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = file.fieldname === 'pdf' ? './uploads/pdfs/' : './uploads/covers/';
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'pdf') {
    cb(null, file.mimetype === 'application/pdf');
  } else if (file.fieldname === 'coverImage') {
    cb(null, /^image\/(jpeg|png|jpg)$/.test(file.mimetype));
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

// Configure multer upload
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB for images
    files: 2 // Allow both PDF and cover
  }
}).fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// Routes
router.post('/upload', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ 
        message: err.message || 'Error uploading files'
      });
    }

    if (!req.files?.pdf || !req.files?.coverImage) {
      return res.status(400).json({
        message: 'Both PDF and cover image are required'
      });
    }

    try {
      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        genre: req.body.genre,
        pdfUrl: `/uploads/pdfs/${req.files.pdf[0].filename}`,
        coverImage: `/uploads/covers/${req.files.coverImage[0].filename}`,
        isApproved: false
      });

      const savedBook = await book.save();
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
});

module.exports = router;