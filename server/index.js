require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/likes', require('./routes/likes'));
app.use('/api/follows', require('./routes/follows'));
app.use('/api/history', require('./routes/history'));
app.use('/api/playlists', require('./routes/playlists'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Root route for quick browser sanity check
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend API is running',
    health: '/api/health'
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
