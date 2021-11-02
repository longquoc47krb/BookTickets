const Joi = require('joi');

const createRoute = {
  body: Joi.object().keys({
    stationName: Joi.string().required(),
    province: Joi.string().required(),
    stationAddress: Joi.string().required(),
  }),
};
const getRoutes = {
  query: Joi.object().keys({
    stationName: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const getRoute = {
  params: Joi.object().keys({
    stationId: Joi.string().custom(objectId),
  }),
};
const updateRoute = {
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

const deleteRoute = {
  params: Joi.object().keys({
    stationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createRoute,
  deleteRoute,
  getRoute,
  getRoutes,
  updateRoute,

}
