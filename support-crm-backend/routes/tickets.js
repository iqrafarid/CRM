const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Note = require('../models/Note');

async function generateTicketId() {
  const count = await Ticket.countDocuments();
  return `TKT-${String(count + 1).padStart(3, '0')}`;
}

// POST /api/tickets 
router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_email, subject, description } = req.body;

    if (!customer_name || !customer_email || !subject || !description) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const cleanEmail = customer_email.trim().toLowerCase();
    let ticketId = await generateTicketId();

    let ticket;
    let attempts = 0;

    while (attempts < 2) {
      try {
        ticket = new Ticket({
          ticketId,
          customerName: customer_name.trim(),
          customerEmail: cleanEmail,
          subject: subject.trim(),
          description
        });
        await ticket.save();
        break;
      } catch (err) {
        if (err.code === 11000 && attempts === 0) {
          ticketId = await generateTicketId();
          attempts++;
          continue;
        }
        throw err;
      }
    }

    res.status(201).json({
      ticket_id: ticket.ticketId,
      created_at: ticket.createdAt
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error creating ticket' });
  }
});

// GET /api/tickets
router.get('/', async (req, res) => {
  try {
    const { status, search, sort } = req.query;
    const query = {};

    if (status) query.status = status;

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { customerName: regex },
        { customerEmail: regex },
        { subject: regex },
        { description: regex },
        { ticketId: regex }
      ];
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const tickets = await Ticket.find(query).sort({ createdAt: sortOrder });

    const formatted = tickets.map(t => ({
      ticket_id: t.ticketId,
      customer_name: t.customerName,
      subject: t.subject,
      status: t.status,
      created_at: t.createdAt
    }));

    res.json(formatted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching tickets' });
  }
});

// GET /api/tickets/:ticketId 
router.get('/:ticketId', async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    const notes = await Note.find({ ticket: ticket._id }).sort({ createdAt: 1 });

    res.json({
      ticket_id: ticket.ticketId,
      customer_name: ticket.customerName,
      customer_email: ticket.customerEmail,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      created_at: ticket.createdAt,
      notes: notes.map(n => ({
        note_text: n.noteText,
        created_at: n.createdAt
      }))
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching ticket' });
  }
});

// PUT /api/tickets/:ticketId 
router.put('/:ticketId', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    if (status) {
      if (!['Open', 'In Progress', 'Closed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      ticket.status = status;
      await ticket.save();
    }

    if (notes) {
      const note = new Note({ ticket: ticket._id, noteText: notes });
      await note.save();
    }

    res.json({ success: true, updated_at: ticket.updatedAt });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error updating ticket' });
  }
});

module.exports = router;