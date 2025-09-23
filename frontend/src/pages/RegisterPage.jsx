// frontend/src/pages/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AuthForm.module.css'; // Importa o MESMO estilo compartilhado

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      await register(name, email, password);
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro. Tente novamente.';
      setError(errorMessage);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <h2 className={styles.formTitle}>Criar Conta</h2>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        {success && <p className={styles.successMessage}>{success}</p>}
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="name">Nome</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={styles.formInput} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.formInput} />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="password">Senha</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.formInput} />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="confirmPassword">Confirmar Senha</label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={styles.formInput} />
        </div>

        <button type="submit" className={styles.submitButton}>Registrar</button>

        <p className={styles.switchPageLink}>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </form>
    </div>
  );
}