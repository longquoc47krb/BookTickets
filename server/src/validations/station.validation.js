const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createStation = {
  body: Joi.object().keys({
    stationName: Joi.string().required(),
    province: Joi.string().required(),
    stationAddress: Joi.string().required(),
  }),
};
const getStations = {
  query: Joi.object().keys({
    stationName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getStation = {
  params: Joi.object().keys({
    stationId: Joi.string().custom(objectId),
  }),
};
const updateStation = {
  params: Joi.object().keys({
    stationId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      stationName: Joi.string(),
      province: Joi.string(),
      stationAddress: Joi.string(),
    })
    .min(1),
};

const deleteStation = {
  params: Joi.object().keys({
    stationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createStation,
  deleteStation,
  getStation,
  getStations,
  updateStation,

}
