# Ver canciones y a que playlists pertenecen segun _Usuario_
SELECT us.user, so.artist, so.title, so.rating, pl.name as playlists
FROM public.songs so
JOIN public.users us ON us.id = so.id
JOIN public.playlists pl ON pl.user_id = us.id

# Filtra canciones segun _titulo_ o _artista_
SELECT * FROM songs
WHERE title ILIKE '%buenos%'
OR artist ILIKE '%buscar%';

# Songs
UPDATE songs SET genre = '[' || genre || ']' WHERE 1 = 1