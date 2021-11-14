const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');
const { SeatSchema } = require('./seat.model');
const routeSchema = mongoose.Schema(
  {
    fromStationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
    },
    toStationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
    },
    startTime: {
      type: Date,
      required: true,
    },
    seats: [SeatSchema],
    price: { type: Number, default: 0 },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
routeSchema.plugin(toJSON);
routeSchema.plugin(paginate);

/**
 * @typedef Route
 */
const Route = mongoose.model('Route', routeSchema);

module.exports = Route;
