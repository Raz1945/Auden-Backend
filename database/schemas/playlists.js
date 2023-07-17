// Esquema para la creacion de una tabla de 'playlists' utilizando Knex.
const playlistSchema = (table) => {
  table.increments('id').primary().unique();
  table.string('name').notNullable();
  table.integer('user_id').notNullable();
  table.timestamps(true, true); // Agregar columnas de registro de tiempo
};

module.exports = playlistSchema;
