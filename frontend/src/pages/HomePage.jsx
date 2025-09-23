// frontend/src/pages/HomePage.jsx
 import { useState, useEffect } from 'react';
 import { Link } from 'react-router-dom';
 import api from '../services/api';
 import styles from './HomePage.module.css';
 import { useAuth } from '../context/AuthContext';

 export default function HomePage() {
   const [polls, setPolls] = useState([]);
   const [loading, setLoading] = useState(true);
   const { user } = useAuth();

   useEffect(() => {
     const fetchPolls = async () => {
       try { const response = await api.get('/polls'); setPolls(response.data); }
       catch (error) { console.error("Erro ao buscar enquetes:", error); }
       finally { setLoading(false); }
     };
     fetchPolls();
   }, []);

   const handleDelete = async (e, pollId) => {
     // ... (código de deletar, sem alterações)
     e.stopPropagation();
     e.preventDefault();
     if (window.confirm('Tem certeza que deseja excluir esta enquete?')) {
       try {
         await api.delete(`/polls/${pollId}`);
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

               // --- INÍCIO DO CÓDIGO DE DEPURAÇÃO ---
               console.log("--- Verificando Permissões para a Enquete:", poll.title, "---");
               console.log("Usuário Logado (user):", user);
               console.log("ID do Criador da Enquete (poll.creator):", poll.creator);
               console.log("IDs são iguais?", user ? user.id === poll.creator : false);
               console.log("Usuário é admin?", user ? user.role === 'admin' : false);
               // --- FIM DO CÓDIGO DE DEPURAÇÃO ---

               const canDelete = user && (user.role === 'admin' || user.id === poll.creator);

               const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
               return (
                 <Link key={poll._id} to={`/poll/${poll._id}`} className={styles.pollItem}>
                   <div className={styles.pollItemContent}>
                     <div>
                       <h2 className={styles.pollItemTitle}>{poll.title}</h2>
                       <p className={styles.pollItemVotes}>{totalVotes} {totalVotes === 1 ? 'voto' : 'votos'}</p>
                     </div>
                     {canDelete && (
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
           <div className={styles.noPollsMessage}><p>Nenhuma enquete encontrada.</p></div>
         )}
       </div>
     </div>
   );
 }