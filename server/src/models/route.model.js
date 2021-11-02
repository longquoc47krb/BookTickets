const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const routeSchema = mongoose.Schema(
  {
    departure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Station',
    },
    price: {
      type: Number,
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    departureProvince: {
      type: String,
      required: true,
    },
    arrivalProvince: {
      type: String,
      required: true,
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
