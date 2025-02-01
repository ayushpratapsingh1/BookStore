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
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://apsbookstore.vercel.app',
      'http://localhost:5173',
      'https://loginaps.duckdns.org'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition']
};

app.use(cors(corsOptions));

// Add additional security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

app.use(express.json());

// Serve static files with proper headers
app.use('/uploads', (req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static('uploads'));

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
