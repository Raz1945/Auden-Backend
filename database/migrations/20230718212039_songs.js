const songsSchema = require("../schemas/songs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTableIfNotExists('songs', songsSchema)
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('songs');
  
};
