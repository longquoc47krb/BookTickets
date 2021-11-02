const Joi = require('joi');
const { password, objectId, username } = require('./custom.validation');
const myCustomJoi = Joi.extend(require('joi-phone-number'));

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    username: Joi.string().required().custom(username),
    password: Joi.string().required().custom(password),
    fullName: Joi.string().required(),
    phone: myCustomJoi.string().required().phoneNumber({ defaultCountry: 'VN', format: 'national' }),
    role: Joi.string().required().valid('customer','admin'),
  }),
};
const getUsers = {
  query: Joi.object().keys({
    fullName: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      fullName: Joi.string(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
