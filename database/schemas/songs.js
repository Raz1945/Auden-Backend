// Esquema para la creacion de una tabla de 'canciones' utilizando Knex.
const songsSchema = (table) => {
  table.increments('id').primary().unique();
  table.string('artist').notNullable().unique();
  table.string('title').notNullable().unique();
  table.decimal('duration', 5, 2).defaultTo(0); // seg: 12345,12
  table.string('genre').notNullable();
  table.integer('rating').notNullable();
  table.timestamps(true, true); // Agregar columnas de registro de tiempo
};

module.exports = songsSchema;
