# 📚 BookStore - Digital Library Management System

## Overview
BookStore is a modern, full-stack digital library management system that enables users to upload, manage, and access books online. Built with React and Node.js, it features a responsive design and real-time statistics.

## 🚀 Features

### Book Management
- PDF and cover image upload support
- Genre-based categorization
- Detailed book information display
- Download and read online options

### Interactive UI
- Responsive design for all devices
- Real-time search and filtering
- Interactive statistics dashboard
- Drag-and-drop file uploads
- Toast notifications for user feedback

### Analytics
- Real-time book statistics
- Genre distribution visualization
- Monthly upload/approval tracking
- Interactive charts and graphs

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Chart.js** - Statistics visualization
- **Lucide React** - Icons
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Multer** - File handling
- **CORS** - Cross-origin resource sharing

## 📝 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🚀 Quick Start

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/bookstore.git
cd bookstore
```

2. **Backend Setup**
```bash
cd Backend
npm install

# Create .env file
echo "MONGO_URI=your_mongodb_uri" > .env

# Start server
npm start
```

3. **Frontend Setup**
```bash
cd Frontend
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000" > .env

# Start development server
npm run dev
```

## 📁 Project Structure

```
bookstore/
├── Backend/
│   ├── models/
│   │   └── Book.js
│   ├── routes/
│   │   ├── books.js
│   │   └── stats.js
│   ├── uploads/
│   │   ├── covers/
│   │   └── pdfs/
│   └── server.js
└── Frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── App.jsx
    └── index.html
```

## 🔧 Configuration

### Backend Environment Variables
```env
MONGO_URI=mongodb://localhost:27017/bookstore
PORT=5000
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5000
```

## 📱 API Endpoints

### Books
- `GET /api/books` - Get all books
- `POST /api/books/upload` - Upload new book
- `GET /api/stats` - Get library statistics

## 🌟 Key Features Implementation

### File Upload System
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.fieldname === 'pdf' ? 'pdfs' : 'covers';
    cb(null, `uploads/${folder}`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});
```

### Static File Serving
```javascript
app.use('/uploads', express.static('uploads'));
```

## 🚀 Deployment

### Backend Deployment (AWS EC2)
1. Launch EC2 instance
2. Install dependencies
3. Configure Nginx
4. Set up SSL with Let's Encrypt

### Frontend Deployment (Vercel)
1. Push to GitHub
2. Connect to Vercel
3. Configure environment variables
4. Deploy

## 🔒 Security Features

- CORS configuration
- File type validation
- Size limits for uploads
- Secure file storage
- Error handling

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## 🙏 Acknowledgments

- MongoDB Team
- React Community
- Node.js Community
