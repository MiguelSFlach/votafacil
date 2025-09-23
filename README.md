# 💻 VotaFácil - Sistema de Votação em Tempo Real

Projeto full-stack de um sistema de criação e votação em enquetes, com atualização dos resultados em tempo real. Desenvolvido como trabalho para a disciplina de [Nome da Disciplina] da [Nome da Faculdade].

## ✨ Features

-   [ ] Cadastro e Login de usuários com autenticação via JWT.
-   [ ] Criação de enquetes com múltiplas opções.
-   [ ] Votação única por usuário em cada enquete.
-   [ ] Visualização de resultados em tempo real com Socket.io.
-   [ ] Interface reativa construída com React e Vite.

## 🚀 Tecnologias Utilizadas

### Backend
-   Node.js
-   Express.js
-   MongoDB com Mongoose
-   Socket.io para comunicação em tempo real
-   JSON Web Token (JWT) para autenticação

### Frontend
-   React com Vite
-   React Router para navegação
-   Axios para requisições HTTP
-   Socket.io Client
-   CSS Modules para estilização

## ⚙️ Como Executar o Projeto

### Pré-requisitos
-   Node.js (versão LTS recomendada)
-   MongoDB (instalado localmente ou um cluster no Atlas)

### Backend
1.  Navegue até a pasta do backend: `cd backend`
2.  Instale as dependências: `npm install`
3.  Crie um arquivo `.env` na raiz da pasta `backend` e adicione as seguintes variáveis:
    ```
    PORT=5000
    MONGO_URI=sua_string_de_conexao_com_o_mongodb
    JWT_SECRET=sua_chave_secreta_para_jwt
    ```
4.  Inicie o servidor: `npm start`

### Frontend
1.  Abra um **novo terminal** e navegue até a pasta do frontend: `cd frontend`
2.  Instale as dependências: `npm install`
3.  Inicie a aplicação: `npm run dev`

A aplicação estará disponível em `http://localhost:5173` (ou a porta indicada no terminal).