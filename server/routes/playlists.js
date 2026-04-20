const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const PlaylistTrack = require('../models/PlaylistTrack');
const auth = require('../middleware/auth');

// GET /api/playlists  — all playlists for user
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user_id: req.user.id }).sort({ created_at: -1 });
    res.json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/playlists/:id  — single playlist
router.get('/:id', async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Not found' });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/playlists/:id/tracks  — tracks in playlist
router.get('/:id/tracks', async (req, res) => {
  try {
    const tracks = await PlaylistTrack.find({ playlist_id: req.params.id }).sort({ position: 1 });
    res.json(tracks.map(t => t.track_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/playlists  — create playlist
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const playlist = await Playlist.create({ user_id: req.user.id, name, description });
    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/playlists/:id/tracks  — add track to playlist
router.post('/:id/tracks', auth, async (req, res) => {
  try {
    const { track_id, position } = req.body;
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (playlist.user_id.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const count = await PlaylistTrack.countDocuments({ playlist_id: req.params.id });
    const pt = await PlaylistTrack.create({ playlist_id: req.params.id, track_id, position: position ?? count });
    res.json(pt);
  } catch (err) {
    if (err.code === 11000) return res.json({ message: 'Track already in playlist' });
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/playlists/:id/tracks/:trackId  — remove track
router.delete('/:id/tracks/:trackId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Not found' });
    if (playlist.user_id.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    await PlaylistTrack.deleteOne({ playlist_id: req.params.id, track_id: req.params.trackId });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/playlists/:id  — delete playlist
router.delete('/:id', auth, async (req, res) => {
  try {
    await Playlist.deleteOne({ _id: req.params.id, user_id: req.user.id });
    await PlaylistTrack.deleteMany({ playlist_id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
