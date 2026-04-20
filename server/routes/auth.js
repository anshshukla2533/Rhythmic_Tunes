const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (user) => jwt.sign(
  { id: user._id, email: user.email, display_name: user.display_name },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, display_name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    const user = await User.create({ email, password, display_name: display_name || email.split('@')[0] });
    res.json({ token: sign(user), user: { id: user._id, email: user.email, display_name: user.display_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ token: sign(user), user: { id: user._id, email: user.email, display_name: user.display_name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me  (verify token)
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: { id: user._id, email: user.email, display_name: user.display_name } });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
