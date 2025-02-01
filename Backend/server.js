const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/books');
const statsRoutes = require('./routes/stats');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['https://apsbookstore.vercel.app', 'http://localhost:5173'], // Vite default port
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/stats', statsRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Start server
const findAvailablePort = async (startPort) => {
    const net = require('net');
    
    const isPortAvailable = (port) => {
      return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(port, () => {
          server.close();
          resolve(true);
        });
        server.on('error', () => resolve(false));
      });
    };
  
    let port = startPort;
    while (!(await isPortAvailable(port))) {
      port++;
    }
    return port;
  };
  
  // Replace existing app.listen with:
  const startServer = async () => {
    try {
      const availablePort = await findAvailablePort(PORT);
      const server = app.listen(availablePort, () => {
        console.log(`Server running on port ${availablePort}`);
        console.log(`API URL: http://localhost:${availablePort}`);
      });
  
      server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
          console.log(`Port ${availablePort} is busy, trying next port...`);
          server.close();
          startServer();
        } else {
          console.error('Server error:', error);
        }
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();
