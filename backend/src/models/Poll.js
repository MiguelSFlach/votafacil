// backend/src/models/Poll.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Um sub-schema para as opções da enquete
const optionSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

// O schema principal da enquete
const pollSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  options: [optionSchema],

  // --- A LINHA QUE FALTAVA ---
  // Diz ao banco de dados que cada enquete precisa ter um criador,
  // e que esse criador é um ID que se refere a um documento na coleção 'User'.
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Poll', pollSchema);