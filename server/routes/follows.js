const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const auth = require('../middleware/auth');

// GET /api/follows  — all followed artist IDs
router.get('/', auth, async (req, res) => {
  try {
    const follows = await Follow.find({ user_id: req.user.id });
    res.json(follows.map(f => f.artist_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/follows/:artistId  — toggle follow
router.post('/:artistId', auth, async (req, res) => {
  try {
    const { artistId } = req.params;
    const existing = await Follow.findOne({ user_id: req.user.id, artist_id: artistId });
    if (existing) {
      await Follow.deleteOne({ _id: existing._id });
      return res.json({ following: false });
    }
    await Follow.create({ user_id: req.user.id, artist_id: artistId });
    res.json({ following: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
