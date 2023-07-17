# Auden-Backend

npm init

npm install

npm i dotenv express express-validator

npm i bcryptjs cors jsonwebtoken

npm i knex pg


# Comandos
npx knex migrate:make <nombre_archivo>

npx knex migrate:latest


<!-- ! Respaldo -->
-- Table: public.playlist

-- DROP TABLE IF EXISTS public.playlist;

CREATE TABLE IF NOT EXISTS public.playlist
(
    id integer NOT NULL DEFAULT nextval('playlist_id_seq'::regclass),
    name character varying(200) COLLATE pg_catalog."default" NOT NULL,
    user_id integer,
    CONSTRAINT playlist_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.playlist
    OWNER to "Raz1945";