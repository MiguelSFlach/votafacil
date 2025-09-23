const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
  poll: { type: Schema.Types.ObjectId, ref: 'Poll', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  optionIndex: { type: Number, required: true }
});

// ESTA LINHA É A MAIS IMPORTANTE!
// Ela cria um índice no banco de dados que impede que exista mais de um
// documento com a mesma combinação de 'poll' e 'user'.
voteSchema.index({ poll: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);