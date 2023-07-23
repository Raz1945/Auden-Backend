const usersSchema = require("../schemas/users");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTableIfNotExists('users', usersSchema)
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('users');
  
};
