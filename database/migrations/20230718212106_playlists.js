const playlistsSchema = require('../schemas/playlists');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTableIfNotExists('playlists', playlistsSchema);
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('playlists');
};
