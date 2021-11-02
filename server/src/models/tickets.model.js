const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const ticketSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    routeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },
    arrayOfSeat: {
      type: [String]
    },
    departurePlace: {
      type: String
    },
    arrivalPlace: {
      type: String
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true
    },
    totalPrice: {
      type: Number,
      required: true
    },
    departureTime: {
      type: Date,
      required: true
    },
    brandName: {
      type: String,
      required: true
    }
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
