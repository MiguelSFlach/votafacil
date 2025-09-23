// frontend/src/pages/PollPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import io from 'socket.io-client';
import styles from './PollPage.module.css'; // Importa nossos novos estilos

export default function PollPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [poll, setPoll] = useState(null);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    api.get(`/polls/${id}`)
      .then(response => setPoll(response.data))
      .catch(err => setError('Enquete não encontrada.'));

    // A lógica do Socket.io permanece a mesma
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.emit('joinPoll', id);
    socket.on('voteUpdate', (updatedPoll) => {
      setPoll(updatedPoll);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleVote = async (e) => {
    e.preventDefault();
    if (selectedOption === null) return;
    setError('');

    try {
      await api.post(`/polls/${id}/vote`, { optionIndex: selectedOption });
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao registrar seu voto.');
    }
  };

  if (!poll) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando enquete...</p>;
  
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pollTitle}>{poll.title}</h1>
      <p className={styles.totalVotes}>Total de votos: {totalVotes}</p>
      
      <div className={styles.pollCard}>
        <form onSubmit={handleVote}>
          <ul className={styles.optionsList}>
            {poll.options.map((option, index) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              // Combina classes condicionalmente
              const labelClassName = `${styles.optionLabel} ${selectedOption === index ? styles.optionLabelSelected : ''}`;

              return (
                <li key={index}>
                  <label htmlFor={`option-${index}`} className={labelClassName}>
                    <div className={styles.optionContent}>
                      <div className={styles.radioAndText}>
                        <input
                          type="radio"
                          id={`option-${index}`}
                          name="pollOption"
                          value={index}
                          checked={selectedOption === index}
                          onChange={() => setSelectedOption(index)}
                          className={styles.radioButton}
                        />
                        <span>{option.text}</span>
                      </div>
                      <span className={styles.voteCount}>{option.votes} votos</span>
                    </div>
                    <div className={styles.resultBarContainer}>
                      <div className={styles.resultBar} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>

          {token ? (
            <button type="submit" disabled={selectedOption === null} className={styles.voteButton}>
              Votar
            </button>
          ) : (
            <p className={styles.loginMessage}>
              Você precisa <Link to="/login">fazer login</Link> para votar.
            </p>
          )}
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </div>
    </div>
  );
}