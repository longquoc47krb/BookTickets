const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const stationSchema = mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true,
    },
    stationAddress: String,
    province: String,
    statusActive: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
stationSchema.plugin(toJSON);
stationSchema.plugin(paginate);

/**
 * @typedef Station
 */
const Station = mongoose.model('Station', stationSchema);

module.exports = Station;
