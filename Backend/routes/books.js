const router = require('express').Router();
const Book = require('../models/Book');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create directories with proper permissions
const createUploadDirs = () => {
  const uploadDir = '/app/uploads';
  const dirs = [
    path.join(uploadDir, 'pdfs'),
    path.join(uploadDir, 'covers')
  ];
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true, mode: 0o777 });
      console.log(`Created directory: ${dir}`);
    }
  });
  return uploadDir;
};

const uploadDir = createUploadDirs();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const folder = file.fieldname === 'pdf' ? 'pdfs' : 'covers';
    const dest = path.join(uploadDir, folder);
    console.log(`Saving file to: ${dest}`);
    cb(null, dest);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    console.log(`Generated filename: ${filename}`);
    cb(null, filename);
  }
});

// File filter for PDFs and images
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

// Configure multer upload
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
    console.error('Error fetching books:', err);
    res.status(500).json({ message: err.message });
  }
});

// Upload endpoint with enhanced error handling
router.post('/upload', (req, res) => {
  upload(req, res, async function(err) {
    console.log('Upload request received');
    
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ message: err.message });
    }    

    if (!req.files?.pdf?.[0] || !req.files?.coverImage?.[0]) {
      console.error('Missing files in request');
      return res.status(400).json({ message: 'Both PDF and cover image are required' });
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
      console.log('Book saved successfully:', savedBook._id);
      res.status(201).json(savedBook);
    } catch (error) {
      console.error('Error saving book:', error);
      res.status(400).json({ message: error.message });
    }
  });
});

module.exports = router;