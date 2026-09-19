import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import './TicketCard.css';

function TicketCard({ ticket }) {
  return (
    <div className="ticket-card">
      <div className="ticket-card-id">{ticket.ticket_id}</div>
      <div>
        <Link to={`/tickets/${ticket.ticket_id}`} className="ticket-card-link">
          {ticket.subject}
        </Link>
        <div className="ticket-card-customer">{ticket.customer_name}</div>
      </div>
      <StatusBadge status={ticket.status} />
      <div />
      <div className="ticket-card-date">
        {new Date(ticket.created_at).toLocaleDateString()}
      </div>
    </div>
  );
}

export default TicketCard;