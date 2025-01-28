const router = require('express').Router();
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define absolute upload directory
const uploadDir = path.join(__dirname, '..', 'uploads');
const pdfDir = path.join(uploadDir, 'pdfs');
const coverDir = path.join(uploadDir, 'covers');

// Ensure directories exist
const dirs = [uploadDir, pdfDir, coverDir];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const folder = file.fieldname === 'pdf' ? pdfDir : coverDir;
    cb(null, folder);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') {
    cb(null, true);
  } else if (file.fieldname === 'coverImage' && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only PDFs and images are allowed.'), false);
  }
};

// Multer upload configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
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
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
});

// Upload a new book
router.post('/upload', (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    } else if (err) {
      return res.status(500).json({ message: 'Unknown error: ' + err.message });
    }

    try {
      if (!req.files.pdf || !req.files.coverImage) {
        return res.status(400).json({ message: 'Both PDF and Cover Image are required.' });
      }

      const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        genre: req.body.genre,
        uploader: req.body.uploader,
        pdfUrl: `/uploads/pdfs/${req.files.pdf[0].filename}`,  // Ensure correct path
        coverImage: `/uploads/covers/${req.files.coverImage[0].filename}`,  // Ensure correct path
        isApproved: false
      });

      const savedBook = await book.save();
      res.status(201).json(savedBook);
    } catch (error) {
      res.status(400).json({ message: 'Error saving book: ' + error.message });
    }
  });
});

module.exports = router;
