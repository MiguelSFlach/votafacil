// frontend/src/App.jsx
import { useState } from 'react'; // Importar useState
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreatePollPage from './pages/CreatePollPage';
import PollPage from './pages/PollPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // O estado da busca agora vive aqui, no componente principal
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AuthProvider>
      <div>
        {/* Passamos o estado e a função para a Navbar */}
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <main className="container mx-auto p-4 max-w-7xl"> {/* Aumentei um pouco o max-w */}
          <Routes>
            {/* Passamos o termo de busca para a HomePage */}
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