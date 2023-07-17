const knex = require('../database/config/db');

const getUser = async (data) => {
  const userExist = await knex
    .select('user')
    .from('users')
    .where({ email: data.email, password: data.password })
    .first();

  return userExist;
};

const findUser = async (data) => {
  const userExists = await knex
    .select('*')
    .from('users')
    .where('email', data.email)
    .first();

  return userExists;
};

const createUser = async (data) => {
  const newUser = await knex
    .insert({
      email: data.email,
      user: data.user,
      password: data.password,
    })
    .into('users')
    .returning('*');

  return newUser;
};

module.exports = { getUser, findUser, createUser };
