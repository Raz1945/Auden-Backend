const playlist_songSchema = (table) => {
  table.increments('id').primary();
  table
    .integer('playlist_id')
    .notNullable()
    .references('id')
    .inTable('playlists'); //! Ver referencia
  table
    .integer('songs_id')
    .notNullable()
    .references('id')
    .inTable('songs'); //! Ver referencia
};

module.exports = playlist_songSchema;
