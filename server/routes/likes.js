const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const auth = require('../middleware/auth');

// GET /api/likes  — all liked track IDs for current user
router.get('/', auth, async (req, res) => {
  try {
    const likes = await Like.find({ user_id: req.user.id });
    res.json(likes.map(l => l.track_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/likes/:trackId  — toggle like
router.post('/:trackId', auth, async (req, res) => {
  try {
    const { trackId } = req.params;
    const existing = await Like.findOne({ user_id: req.user.id, track_id: trackId });
    if (existing) {
      await Like.deleteOne({ _id: existing._id });
      return res.json({ liked: false });
    }
    await Like.create({ user_id: req.user.id, track_id: trackId });
    res.json({ liked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
