// frontend/src/App.jsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import styles from './App.module.css';

// Importa os componentes de página e Navbar
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import CreatePollPage from './pages/CreatePollPage.jsx';
import PollPage from './pages/PollPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  // O estado da busca é controlado aqui, no componente pai
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AuthProvider>
      <div>
        {/* Passamos o estado e a função para a Navbar poder atualizá-lo */}
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <main className={styles.mainContainer}>
          <Routes>
            {/* Passamos o termo da busca para a HomePage poder filtrar os resultados */}
            <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
            
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/poll/:id" element={<PollPage />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/polls/new" element={<CreatePollPage />} />
            </Route>
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;