// Esquema para la creación de una tabla de playlists utilizando Knex.
const playlistSchema = (table) => {
  table.increments('id').primary().unique();
  table.string('name').notNullable();
  table.integer('user_id').unsigned().notNullable();
  table.timestamps(true, true); // Agregar columnas de registro de tiempo

  // Definir la clave foránea hacia la tabla users
  table.foreign('user_id').references('id').inTable('users');
};

module.exports = playlistSchema;
