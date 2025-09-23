const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 }
});

const PollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  options: [OptionSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: Date,
  isClosed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Poll', PollSchema);
