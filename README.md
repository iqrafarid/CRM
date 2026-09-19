# Support CRM System

A full-stack customer support ticketing CRM built for the Datastraw Technologies hiring assessment. It lets support agents log in, create and manage tickets, search and filter them, and track status and notes — solving the problem of tracking customer issues in one place instead of scattered emails/calls.

Built with **React (Vite)** on the frontend, **Node.js + Express** on the backend, **MongoDB** as the database, and **JWT authentication** to secure agent access.

**Live App:** [add your deployed URL here]
**Demo Video:** [add your video link here]

---

## Getting Started / Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster)
- npm (comes with Node.js)

### 1. Clone the repository

```bash
git clone https://github.com/iqrafarid/CRM.git
cd CRM
```

### 2. Set up the backend

```bash
cd support-crm-backend
npm install
```

Create a `.env` file in `support-crm-backend/` (see `.env.example`):
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_long_random_secret


### 3. Set up the frontend

```bash
cd ../support-crm-frontend
npm install
```

Create a `.env` file in `support-crm-frontend/` (see `.env.example`):
VITE_API_URL=http://localhost:5000/api


---

## Usage

### Run the backend
```bash
cd support-crm-backend
node server.js
```
API runs at `http://localhost:5000`.

### Run the frontend
In a separate terminal:
```bash
cd support-crm-frontend
npm run dev
```
App runs at `http://localhost:5173`.

### Basic flow
1. Open the app → you'll be redirected to `/login`
2. Register a new agent account
3. Create a ticket, search/filter the list, open a ticket to update its status or add notes

### API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an agent account |
| POST | `/api/auth/login` | Log in, returns a JWT |
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets?status=&search=&sort=` | List tickets (filter/search/sort) |
| GET | `/api/tickets/:ticketId` | Get one ticket with its notes |
| PUT | `/api/tickets/:ticketId` | Update status and/or add a note |

All `/api/tickets/*` routes require a valid JWT sent as `Authorization: Bearer <token>`.

## Features

- Create tickets with customer name, email, subject, description
- Auto-generated ticket ID (`TKT-001`, `TKT-002`, ...) and timestamp
- List view of all tickets showing ID, customer, title, status, and date
- Live search across name, email, subject, description, and ticket ID
- Filter by status (Open / In Progress / Closed)
- Sort by newest/oldest
- Ticket detail page — update status, add notes
- **Stand-out feature: JWT authentication** — agent register/login, protected routes, bcrypt-hashed passwords

---

## Project Structure
CRM/
├── support-crm-backend/ # Express API + MongoDB
│ ├── models/ # Ticket, Note, User schemas
│ ├── routes/ # tickets.js, auth.js
│ ├── middleware/ # verifyToken.js, isAdmin.js
│ └── server.js
└── support-crm-frontend/ # React app
└── src/
├── api/ # axios calls to backend
├── components/ # SearchBar, TicketCard, StatusBadge, ProtectedRoute
└── pages/ # HomePage, CreateTicketPage, TicketDetailPage, LoginPage, RegisterPage


---

## My Approach

This is a single-role internal tool for support agents (not customer-facing) — agents log in and create/manage tickets on behalf of customers who contact them through other channels (phone, email, etc.). I chose JWT authentication as my stand-out feature over a simpler static API key, since it's a more realistic, reusable auth pattern, with bcrypt-hashed passwords and protected routes.

**Tradeoff:** the auth system is intentionally minimal — no refresh tokens, password reset, or email verification — scoped out to keep focus on the core ticketing features within the time available.

**With more time, I would add:**
- Pagination for large ticket volumes
- A lightweight customer-facing status page (no login, ticket-ID lookup only)
- Role-based permissions (e.g. only admins can delete tickets)

---

## License

This project was built as a hiring assessment submission for Datastraw Technologies and is not currently under an open-source license.

---

## Contact / Author

**Iqra Farid**
GitHub: [@iqrafarid](https://github.com/iqrafarid)
LinkedIn: [https://www.linkedin.com/in/iqra-farid-5183b42b5]


