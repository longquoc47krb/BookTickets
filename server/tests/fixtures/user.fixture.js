const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const faker = require('faker');
const User = require('../../src/models/customer.model');

const password = 'password1';
const salt = bcrypt.genSaltSync(8);
const hashedPassword = bcrypt.hashSync(password, salt);

const userOne = {
  _id: mongoose.Types.ObjectId(),
  fullName: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'customer',
  isEmailVerified: false,
};

const userTwo = {
  _id: mongoose.Types.ObjectId(),
  fullName: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'customer',
  isEmailVerified: false,
};

const admin = {
  _id: mongoose.Types.ObjectId(),
  fullName: faker.name.findName(),
  email: faker.internet.email().toLowerCase(),
  password,
  role: 'admin',
  isEmailVerified: false,
};

const insertUsers = async (users) => {
  await User.insertMany(users.map((customer) => ({ ...customer, password: hashedPassword })));
};

module.exports = {
  userOne,
  userTwo,
  admin,
  insertUsers,
};
