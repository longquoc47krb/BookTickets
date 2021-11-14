const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { SeatSchema } = require('./seat.model');

const ticketSchema = mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    seats: [SeatSchema],
    totalPrice: Number,
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
ticketSchema.plugin(toJSON);
ticketSchema.plugin(paginate);

/**
 * @typedef Route
 */
const Tickets = mongoose.model('Tickets', ticketSchema);

module.exports = Tickets;
