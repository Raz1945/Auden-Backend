select * from playlists

SELECT 
	us.user,
	so.title as "cancion",
	so.duration as "duracion",
	so.artist as "artista",
	so.rating as "rating",
	pl.name as "playlist"
FROM playlist_song as ps
JOIN songs as so ON ps.song_id = so.id
JOIN playlists as pl ON ps.playlist_id = pl.id
JOIN users as us ON pl.user_id = us.id

WHERE condicion;
