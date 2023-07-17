// Esquema para la creacion de una tabla de usuarios utilizando Knex.
const usersSchema = (table) => {
  table.increments('id').primary().unique();
  table.string('email').notNullable().unique();
  table.string('user').notNullable().unique();
  table.string('password').notNullable();
  table.timestamps(true, true); // Agregar columnas de registro de tiempo
};

module.exports = usersSchema;
