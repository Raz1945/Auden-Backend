const knex = require('../database/config/db');

exports.getAll = () => {
  return knex.select('*').from('users');
};

// module.exports = {getAll};
