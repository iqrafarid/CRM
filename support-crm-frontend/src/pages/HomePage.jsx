import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTickets } from '../api/tickets';
import TicketCard from '../components/TicketCard';
import SearchBar from '../components/SearchBar';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    setLoading(true);
    setError('');

    // Debounce: wait 300ms after the user stops typing before calling the API
    const timeoutId = setTimeout(() => {
      getTickets({
        status: status || undefined,
        search: search || undefined,
        sort
      })
        .then(data => setTickets(data))
        .catch(err => {
          console.error(err);
          setError('Failed to load tickets. Please try again.');
        })
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [status, search, sort]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="home-page">
      <nav className="navbar">
        <div className="navbar-brand">Support CRM</div>
        <div className="navbar-user">
          {user && <span className="navbar-username">{user.name}</span>}
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="home-page-header">
        <h1>Support Tickets</h1>
        <Link to="/create" className="new-ticket-link">+ New Ticket</Link>
      </div>

      <SearchBar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        sort={sort}
        setSort={setSort}
      />

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="loading-state">Loading...</p>
      ) : tickets.length === 0 ? (
        <p className="empty-state">No tickets found. Try adjusting your search or filters.</p>
      ) : (
        <div className="ticket-list">
          {tickets.map(t => (
            <TicketCard key={t.ticket_id} ticket={t} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;