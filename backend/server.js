// ✅ FIX 1: Force proper DNS resolution (important for MongoDB Atlas on Windows)
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

// ✅ FIX 2: Load environment variables FIRST
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// ✅ Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// ✅ Health check
app.get('/', (req, res) => res.json({ message: 'E-Commerce API Running' }));

// ✅ Config
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// ❗ IMPORTANT: Fail fast if env is missing
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

// ✅ Debug (remove later)
console.log("MONGO_URI:", MONGO_URI);

// ✅ Start server
const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error(err);
      }
    });

  } catch (err) {
    console.error('❌ DB Connection Error:', err);
    process.exit(1);
  }
};

startServer();