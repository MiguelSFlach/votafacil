// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css'; // Importa nossos novos estilos

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link to="/" className={styles.brand}>
          VotaFácil
        </Link>

        <div className={styles.userActions}>
          {user ? (
            <>
              <span>Olá, {user.name}!</span>
              <button onClick={logout}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className={styles.registerButton}>
                Registrar
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}