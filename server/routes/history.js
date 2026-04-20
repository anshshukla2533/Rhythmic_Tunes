const express = require('express');
const router = express.Router();
const History = require('../models/History');
const auth = require('../middleware/auth');

// GET /api/history  — last 100 track IDs
router.get('/', auth, async (req, res) => {
  try {
    const history = await History.find({ user_id: req.user.id })
      .sort({ played_at: -1 })
      .limit(100);
    res.json(history.map(h => h.track_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/history/:trackId  — record a play
router.post('/:trackId', auth, async (req, res) => {
  try {
    const entry = await History.create({ user_id: req.user.id, track_id: req.params.trackId });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
