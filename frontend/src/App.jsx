// frontend/src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import styles from './App.module.css'; // Importa os novos estilos

// Importa os componentes de página e Navbar
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePollPage from './pages/CreatePollPage';
import PollPage from './pages/PollPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Sem lógica de busca aqui. Mais simples e limpo.
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <main className={styles.mainContainer}>
          <Routes>
            {/* As páginas não recebem mais a prop 'searchTerm' */}
            <Route path="/" element={<HomePage />} />
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