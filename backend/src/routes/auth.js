const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Rota de Registro
router.post('/register', async (req, res) => {
  try {
    // AJUSTADO: Espera name, email e password do corpo da requisição
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    // Procura por email em vez de username
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Este email já está em uso.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Salva o novo usuário com name, email e o hash da senha
    const newUser = new User({ name, email, passwordHash });
    await newUser.save();

    res.status(201).json({ message: 'Usuário criado com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
});

// Rota de Login
router.post('/login', async (req, res) => {
  try {
    // AJUSTADO: Espera email e password
    const { email, password } = req.body;

    // Procura por email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou senha inválidos.' });
    }

    // Cria o token com o ID do usuário
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '8h' } // Aumentei a expiração para 8 horas
    );

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no login.' });
  }
});

module.exports = router;