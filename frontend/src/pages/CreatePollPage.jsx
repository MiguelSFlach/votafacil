// frontend/src/pages/CreatePollPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from './CreatePollPage.module.css'; // Importa nossos novos estilos

export default function CreatePollPage() {
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const filteredOptions = options.filter(opt => opt.trim() !== '');
    if (filteredOptions.length < 2) {
      setError('A enquete precisa ter pelo menos duas opções preenchidas.');
      return;
    }

    try {
      await api.post('/polls', { title, options: filteredOptions });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar a enquete.');
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.formCard}>
        <h2 className={styles.formTitle}>Criar Nova Enquete</h2>

        {error && <p className={styles.errorMessage}>{error}</p>}
        
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="title">Título da Enquete</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.formInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>Opções</label>
          {options.map((option, index) => (
            <div key={index} className={styles.optionRow}>
              <input
                type="text"
                placeholder={`Opção ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className={styles.formInput}
              />
              {options.length > 2 && (
                <button type="button" onClick={() => handleRemoveOption(index)} className={styles.removeOptionButton}>
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button type="button" onClick={handleAddOption} className={styles.addOptionButton}>
          + Adicionar outra opção
        </button>

        <button type="submit" className={styles.submitButton}>
          Criar Enquete
        </button>
      </form>
    </div>
  );
}