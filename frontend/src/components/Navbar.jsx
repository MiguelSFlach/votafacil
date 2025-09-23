// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar({ searchTerm, setSearchTerm }) {
  const { user, logout } = useAuth();

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Lado Esquerdo */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Link to="/" className={styles.brand}>
            VotaFácil
          </Link>
        </div>

        {/* Centro: Barra de Busca */}
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Buscar por uma enquete..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            {/* Ícone de Lupa (SVG) */}
            <svg className={styles.searchIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </div>
        </div>

        {/* Lado Direito */}
        <div style={{ flex: 1, minWidth: 'fit-content' }} className={styles.userActions}>
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