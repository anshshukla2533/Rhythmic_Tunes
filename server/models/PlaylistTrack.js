const mongoose = require('mongoose');

const playlistTrackSchema = new mongoose.Schema({
  playlist_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', required: true },
  track_id: { type: String, required: true },
  position: { type: Number, default: 0 },
  added_at: { type: Date, default: Date.now }
});

playlistTrackSchema.index({ playlist_id: 1, track_id: 1 }, { unique: true });

module.exports = mongoose.model('PlaylistTrack', playlistTrackSchema);
