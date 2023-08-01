const knex = require('../database/config/db');

// Obtiene los datos de los usuarios
const getUsers = async () => {
  const userExist = await knex.select('*').from('users');
  return userExist;
};

// Verifica que exista el mail
const findUserByEmail = async (data) => {
  const userExists = await knex
    .select('*')
    .from('users')
    .where('email', data.email)
    .first();

  return userExists;
};
const findUserByName = async (data) => {
  const userExists = await knex
    .select('*')
    .from('users')
    .where('name', data.name)
    .first();

  return userExists;
};

// Crea un usuario
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

module.exports = { getUsers, findUserByEmail, createUser,findUserByName };
