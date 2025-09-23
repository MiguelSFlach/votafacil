// frontend/src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import styles from './HomePage.module.css';
import { useAuth } from '../context/AuthContext'; // 1. Importar o useAuth

export default function HomePage() {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // 2. Pegar o usuário logado do contexto

  useEffect(() => {
    // ... (lógica de fetch continua a mesma)
    const fetchPolls = async () => {
      try { const response = await api.get('/polls'); setPolls(response.data); }
      catch (error) { console.error("Erro ao buscar enquetes:", error); }
      finally { setLoading(false); }
    };
    fetchPolls();
  }, []);

  // 3. Nova função para deletar
  const handleDelete = async (e, pollId) => {
    // Impede que o clique no botão também ative o Link para a página da enquete
    e.stopPropagation();
    e.preventDefault();

    if (window.confirm('Tem certeza que deseja excluir esta enquete? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/polls/${pollId}`);
        // Remove a enquete da lista na tela sem precisar recarregar a página
        setPolls(polls.filter(p => p._id !== pollId));
      } catch (error) {
        console.error("Erro ao excluir enquete:", error);
        alert('Falha ao excluir a enquete.');
      }
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Carregando enquetes...</p>;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.createPollContainer}>
        {/* ... (botão de criar enquete continua o mesmo) ... */}
        <Link to="/polls/new" className={styles.createPollCard}>
          <span className={styles.plusIcon}>+</span>
          <span>Criar Nova Enquete</span>
        </Link>
      </div>
      <div className={styles.pollsContainer}>
        <h1 className={styles.pollsTitle}>Enquetes Abertas</h1>
        {polls.length > 0 ? (
          <div className={styles.pollList}>
            {polls.map(poll => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              // 4. Verifica se o usuário logado é o criador da enquete
              const isCreator = user && user.id === poll.creator;

              return (
                <Link key={poll._id} to={`/poll/${poll._id}`} className={styles.pollItem}>
                  <div className={styles.pollItemContent}>
                    <div>
                      <h2 className={styles.pollItemTitle}>{poll.title}</h2>
                      <p className={styles.pollItemVotes}>{totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}</p>
                    </div>
                    {/* 5. Se for o criador, mostra o botão de excluir */}
                    {isCreator && (
                      <button onClick={(e) => handleDelete(e, poll._id)} className={styles.deleteButton}>
                        Excluir
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          // ... (mensagem de "nenhuma enquete" continua a mesma) ...
          <div className={styles.noPollsMessage}><p>Nenhuma enquete encontrada.</p></div>
        )}
      </div>
    </div>
  );
}