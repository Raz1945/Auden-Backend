// Esquema para la creación de una tabla de relación entre playlists y songs utilizando.
const playlist_SongSchema = (table) => {
  table.increments('id').primary().unique();
  table.integer('playlist_id').unsigned().notNullable();
  table.integer('song_id').unsigned().notNullable();
  table.timestamps(true, true); // Agregar columnas de registro de tiempo

  // Definir las claves foráneas
  table.foreign('playlist_id').references('id').inTable('playlists');
  table.foreign('song_id').references('id').inTable('songs');
};

module.exports = playlist_SongSchema;
