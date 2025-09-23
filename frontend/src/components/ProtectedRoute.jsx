// frontend/src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { token } = useAuth();

  // Se não há token, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se há token, renderiza a página filha (no nosso caso, a CreatePollPage)
  return <Outlet />;
}