const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS configuration - Allow Vercel frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://moi-ledger-esg3.vercel.app',
      'http://localhost:5173',
      'http://localhost:3000'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'MOI Ledger API is running', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint to verify API is reachable
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is reachable',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// Debug endpoint to check if user exists (REMOVE IN PRODUCTION)
app.get('/api/debug/user/:email', async (req, res) => {
  try {
    const User = require('./models/User');
    const email = req.params.email.trim().toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ 
        found: false, 
        message: 'User not found',
        searchedEmail: email 
      });
    }
    res.json({ 
      found: true,
      userId: user._id,
      username: user.username,
      email: user.email,
      emailNeedsNormalization: user.email !== email,
      hasPassword: !!user.password,
      passwordLength: user.password?.length,
      passwordStartsWith: user.password?.substring(0, 7), // bcrypt hashes start with $2a$ or $2b$
      createdAt: user.createdAt
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Debug endpoint to test password (REMOVE IN PRODUCTION)
app.post('/api/debug/test-password', async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const User = require('./models/User');
    const { email, password } = req.body;
    
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.json({ 
        found: false,
        searchedEmail: normalizedEmail
      });
    }
    
    const isMatch = await bcrypt.compare(normalizedPassword, user.password);
    
    res.json({
      found: true,
      userId: user._id,
      email: user.email,
      inputEmail: normalizedEmail,
      emailsMatch: user.email === normalizedEmail,
      inputPasswordLength: normalizedPassword.length,
      storedPasswordLength: user.password.length,
      passwordMatch: isMatch,
      storedPasswordStartsWith: user.password.substring(0, 7)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/functions', require('./routes/functions'));
app.use('/api/contributions', require('./routes/contributions'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('ERROR: MONGO_URI environment variable is not set!');
  console.error('Please set MONGO_URI in your Render environment variables.');
  process.exit(1);
}

console.log('Starting server...');
console.log('PORT:', PORT);
console.log('MONGO_URI:', MONGO_URI ? 'Set (hidden)' : 'NOT SET');

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Health check available at http://localhost:${PORT}/health`);
    });
  })
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    console.error('Full error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
