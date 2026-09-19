const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  noteText: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);