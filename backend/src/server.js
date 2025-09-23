// backend/src/server.js

// 1. Importar dotenv para gerenciar variáveis de ambiente
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

// --- ROTAS ---
// Certifique-se de que os caminhos para os arquivos de rota estão corretos
const pollRoutes = require('./routes/polls');
const authRoutes = require('./routes/auth'); // 2. ADICIONADO: Importando rotas de autenticação

const app = express();
const server = http.createServer(app);

// Configuração do Socket.io permitindo qualquer origem
// CÓDIGO NOVO E CORRIGIDO
const VERCEL_FRONTEND_URL = "https://votafacil-o7g7.vercel.app"; // <-- COLOQUE A URL DO SEU SITE AQUI

const io = new Server(server, {
  cors: {
    origin: [VERCEL_FRONTEND_URL, "http://localhost:5173"], // Permite ambos
    methods: ["GET", "POST"]
  }
});

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// Middleware para injetar o 'io' em cada requisição
// Assim, você pode emitir eventos de dentro das suas rotas (ex: ao criar uma enquete)
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- CONEXÃO COM O BANCO DE DADOS ---
// Usando a variável de ambiente para a URL do MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/votafacil';

mongoose.connect(MONGO_URI) // 3. REMOVIDO: Opções desnecessárias
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// --- USO DAS ROTAS ---
// 4. CORRIGIDO: Adicionando o prefixo /api
app.use('/api/polls', pollRoutes);
app.use('/api/auth', authRoutes); // 2. ADICIONADO: Usando as rotas de autenticação

// --- LÓGICA DO SOCKET.IO ---
io.on('connection', socket => {
  console.log('🟢 Usuário conectado:', socket.id);

  socket.on('joinPoll', pollId => {
    socket.join(pollId);
    console.log(`Usuário ${socket.id} entrou na sala da enquete ${pollId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Usuário desconectado:', socket.id);
  });
});

// --- INICIAR SERVIDOR ---
// Usando a variável de ambiente para a porta
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});