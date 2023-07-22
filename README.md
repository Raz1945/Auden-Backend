# Auden-Backend
npm init
npm install
npm i dotenv express express-validator
npm i bcryptj cors jsonwebtoken
npm i nodemon knex pg


# Comandos migracion

## Crear
- para crear archivos de migración  
npx knex migrate:make <nombre_archivo>

## Subir
- Para ejecutar la siguiente migración que aún no se ha ejecutado
npx knex migrate:up

- Para ejecutar la migración especificada que aún no se ha ejecutado
npx knex migrate:up <nomre_del_archivo>

  o se puede usar este para subir lo ultimo. 
npx knex migrate:latest


## Revertir
- Para revertir el último lote de migraciones:
npx knex migrate:rollback

- Para revertir todas las migraciones completadas:
npx knex migrate:rollback --all


## Para enumerar las migraciones completadas y pendientes:
npx knex migrate:list
