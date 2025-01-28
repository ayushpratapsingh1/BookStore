const router = require('express').Router();
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories if they don't exist
const dirs = ['./uploads', './uploads/pdfs', './uploads/covers'];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    if (file.fieldname === 'pdf') {
      cb(null, './uploads/pdfs/');
    } else if (file.fieldname === 'coverImage') {
      cb(null, './uploads/covers/');
    }
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'pdf') {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only PDF is allowed!'), false);
    }
  } else if (file.fieldname === 'coverImage') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type, only images are allowed!'), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
}).fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]);

// Get all approved books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ isApproved: true });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload endpoint
router.post('/upload', (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Unknown error: ' + err.message });
    }

    try {
      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        genre: req.body.genre,
        uploader: req.body.uploader,
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
