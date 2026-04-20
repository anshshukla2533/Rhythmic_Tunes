const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  track_id: { type: String, required: true },
  played_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
