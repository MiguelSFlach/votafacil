// frontend/src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthForm.module.css'; // Importa o estilo compartilhado

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError('Falha no login. Verifique seu email e senha.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <h2 className={styles.formTitle}>Login</h2>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>

        <button type="submit" className={styles.submitButton}>Entrar</button>

        <p className={styles.switchPageLink}>
          Não tem uma conta?{' '}
          <Link to="/register">Crie uma agora</Link>
        </p>
      </form>
    </div>
  );
}