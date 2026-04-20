const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  track_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

likeSchema.index({ user_id: 1, track_id: 1 }, { unique: true });

module.exports = mongoose.model('Like', likeSchema);
