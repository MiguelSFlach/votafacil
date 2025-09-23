// frontend/src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      setToken(token);
      setUser(user);

      navigate('/');
    } catch (error) {
      console.error("Falha no login", error);
      throw error;
    }
  };

  // --- NOVA FUNÇÃO DE REGISTRO ---
  const register = async (name, email, password) => {
    try {
      // Não espera um token de volta, apenas uma mensagem de sucesso.
      await api.post('/auth/register', { name, email, password });
    } catch (error) {
      console.error("Falha no registro", error);
      // Relança o erro para o formulário poder exibi-lo.
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  // Adicionar 'register' ao valor do contexto
  const authValue = { user, token, login, logout, register };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};