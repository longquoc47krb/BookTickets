const Joi = require('joi');
const { password, username } = require('./custom.validation');
const myCustomJoi = Joi.extend(require('joi-phone-number'));
const register = {
    body: Joi.object().keys({
    email: Joi.string().required().email(),
    username: Joi.string().required().custom(username),
    phone: myCustomJoi.string().required().phoneNumber({ defaultCountry: 'VN', format: 'national' }),
    password: Joi.string().required().custom(password),
    fullName: Joi.string().required(),
    role: Joi.string().valid('customer','admin')
  }),
};

const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
