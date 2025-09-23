// frontend/src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // 1. IMPORTAR a biblioteca para decodificar

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const navigate = useNavigate();

  // ESTE BLOCO FOI ATUALIZADO
  useEffect(() => {
    // Esta função roda sempre que a página carrega
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      try {
        // 2. Decodifica o token para pegar os dados do usuário e a data de expiração
        const decodedUser = jwtDecode(storedToken);

        // Verifica se o token expirou (a data de expiração 'exp' está em segundos)
        const isExpired = decodedUser.exp * 1000 < Date.now();

        if (!isExpired) {
          // Se o token é válido, define o token e o usuário no estado da aplicação
          setToken(storedToken);
          setUser({
            id: decodedUser.id,
            name: decodedUser.name,
            role: decodedUser.role
          });
        } else {
          // Se o token expirou, limpa tudo
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
        }
      } catch (error) {
        // Se o token for inválido por qualquer motivo, limpa tudo
        console.error("Token inválido:", error);
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
      }
    }
  }, []); // O array vazio [] faz isso rodar apenas uma vez, quando o app carrega


  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token); // Salva o token no storage
      setToken(token);
      setUser(user);

      navigate('/');
    } catch (error) {
      console.error("Falha no login", error);
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      await api.post('/auth/register', { name, email, password });
    } catch (error) {
      console.error("Falha no registro", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token'); // Limpa o token do storage
    navigate('/login');
  };

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