// backend/src/routes/polls.js

const express = require('express');
const router = express.Router();
const Poll = require('../models/Poll');
const Vote = require('../models/Vote');
const auth = require('../middleware/auth');

// Criar enquete (sem alterações)
router.post('/', auth, async (req, res) => {
  // ... (código existente está correto)
  try {
    const { title, options } = req.body;
    if (!title || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Título e pelo menos duas opções são necessários.' });
    }
    const poll = new Poll({
      title,
      options: options.map(opt => ({ text: opt, votes: 0 })),
      creator: req.user.id
    });
    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar enquete.' });
  }
});

// Listar enquetes (sem alterações)
router.get('/', async (req, res) => {
  // ... (código existente está correto)
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar enquetes.' });
  }
});

// Buscar enquete específica (sem alterações)
router.get('/:id', async (req, res) => {
  // ... (código existente está correto)
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Enquete não encontrada.' });
    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar enquete.' });
  }
});

// Votar
router.post('/:id/vote', auth, async (req, res) => {
  const pollId = req.params.id;
  const { optionIndex } = req.body;
  const userId = req.user.id;

  try {
    const vote = new Vote({ poll: pollId, user: userId, optionIndex });
    await vote.save();

    const updatedPoll = await Poll.findOneAndUpdate(
      { _id: pollId, [`options.${optionIndex}`]: { $exists: true } },
      // --- LINHA CORRIGIDA ABAIXO ---
      { $inc: { [`options.${optionIndex}.votes`]: 1 } },
      { new: true }
    );

    if (!updatedPoll) {
      // Isso pode acontecer se o optionIndex for inválido
      return res.status(404).json({ message: "Opção ou enquete não encontrada." });
    }

    req.io.to(pollId).emit('voteUpdate', updatedPoll);
    res.json(updatedPoll);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Você já votou nessa enquete.' });
    }
    console.error("Erro ao votar:", err); // Adicionado para depuração
    res.status(500).json({ message: 'Erro ao votar.' });
  }
});

// DELETAR UMA ENQUETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const pollId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role; // Pega o role do token

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: 'Enquete não encontrada.' });
    }

    // VERIFICAÇÃO DE AUTORIZAÇÃO ATUALIZADA
    // Permite a exclusão se o usuário for admin OU se for o criador da enquete
    if (userRole !== 'admin' && poll.creator.toString() !== userId) {
      return res.status(403).json({ message: 'Acesso negado. Você não tem permissão para excluir esta enquete.' });
    }

    // Deleta a enquete e os votos (lógica existente está correta)
    await Poll.findByIdAndDelete(pollId);
    await Vote.deleteMany({ poll: pollId });

    res.json({ message: 'Enquete excluída com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao excluir a enquete.' });
  }
});

module.exports = router;