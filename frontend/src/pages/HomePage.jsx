// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import styles from './HomePage.module.css'; // Importa nossos novos estilos

export default function HomePage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // A lógica para buscar os dados continua a mesma
  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await api.get('/polls');
        setPolls(response.data);
      } catch (error) {
        console.error("Erro ao buscar enquetes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando enquetes...</p>;
  }

  return (
    <div className={styles.pageContainer}>
      
      {/* Coluna da Esquerda: Botão de Criar Enquete */}
      <div className={styles.createPollContainer}>
        <Link to="/polls/new" className={styles.createPollCard}>
          <span className={styles.plusIcon}>+</span>
          <span>Criar Nova Enquete</span>
        </Link>
      </div>

      {/* Coluna da Direita: Lista de Enquetes */}
      <div className={styles.pollsContainer}>
        <h1 className={styles.pollsTitle}>Enquetes Abertas</h1>
        {polls.length > 0 ? (
          <div className={styles.pollList}>
            {polls.map(poll => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              return (
                <Link key={poll._id} to={`/poll/${poll._id}`} className={styles.pollItem}>
                  <h2 className={styles.pollItemTitle}>{poll.title}</h2>
                  <p className={styles.pollItemVotes}>{totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className={styles.noPollsMessage}>
            <p>Nenhuma enquete encontrada.</p>
            <p>Use o botão ao lado para criar a primeira!</p>
          </div>
        )}
      </div>
    </div>
  );
}