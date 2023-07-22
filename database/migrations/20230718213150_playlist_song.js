const playlist_songSchema = require('../schemas/playlist_song');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTableIfNotExists('playlist_song', playlist_songSchema);
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('playlists_song');
};
