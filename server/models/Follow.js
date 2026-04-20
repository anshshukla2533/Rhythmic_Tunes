const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artist_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

followSchema.index({ user_id: 1, artist_id: 1 }, { unique: true });

module.exports = mongoose.model('Follow', followSchema);
