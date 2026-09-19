import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTicket, updateTicket } from '../api/tickets';
import StatusBadge from '../components/StatusBadge';
import './TicketDetailPage.css';

function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const loadTicket = () => {
    setLoading(true);
    getTicket(ticketId)
      .then(data => setTicket(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTicket();
  }, [ticketId]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    await updateTicket(ticketId, { status: newStatus });
    loadTicket();
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      await updateTicket(ticketId, { notes: noteText });
      setNoteText('');
      loadTicket();
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div className="ticket-detail-page">
      <Link to="/">&larr; Back to all tickets</Link>
      <h1>{ticket.ticket_id} — {ticket.subject}</h1>

      <div className="ticket-detail-meta">
        <div>{ticket.customer_name} ({ticket.customer_email})</div>
        <div>Created: {new Date(ticket.created_at).toLocaleString()}</div>
      </div>

      <p>{ticket.description}</p>

      <div className="status-control">
        <StatusBadge status={ticket.status} />
        <select value={ticket.status} onChange={handleStatusChange}>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      <div className="notes-section">
        <h3>Notes</h3>
        {ticket.notes.length === 0 && <p>No notes yet.</p>}
        {ticket.notes.map((n, i) => (
          <div className="note-item" key={i}>
            <div>{n.note_text}</div>
            <div className="note-date">{new Date(n.created_at).toLocaleString()}</div>
          </div>
        ))}

        <form className="add-note-form" onSubmit={handleAddNote}>
          <textarea
            placeholder="Add a note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            rows="2"
          />
          <button type="submit" disabled={savingNote}>
            {savingNote ? 'Saving...' : 'Add Note'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default TicketDetailPage;