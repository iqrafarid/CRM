import './StatusBadge.css';

function StatusBadge({ status }) {
  const statusClass = {
    'Open': 'status-open',
    'In Progress': 'status-in-progress',
    'Closed': 'status-closed'
  }[status] || '';

  return (
    <span className={`status-badge ${statusClass}`}>
      {status}
    </span>
  );
}

export default StatusBadge;