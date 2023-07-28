const knex = require('../database/config/db');

//=== Info ===//
// Muestro las playlist y su contenido segun de un usuario especifico.
const getUserPlaylistData = async (id) => {
  const result = await knex
    .select({
      user: 'us.user',
      playlist: 'pl.name',
    })
    .column(
      'pl.id as playlist_id',
      'ps.song_id',
      'so.title',
      'so.duration',
      'so.artist',
      'so.rating'
    )
    .from('playlists as pl')
    .leftJoin('playlist_song as ps', 'pl.id', 'ps.playlist_id')
    .leftJoin('songs as so', 'ps.song_id', 'so.id')
    .join('users as us', 'pl.user_id', 'us.id')
    .where('us.id', id)
    .orderBy('pl.name');

  return result;
};

//=== Songs ===//
// Muesto todas las canciones de la base de datos.
const getAllSongs = () => {
  return knex.select('*').from('songs');
};
// Realiza una busqueda
const searchSongs = async (search) => {
  try {
    // console.log('Valor de búsqueda:', search); 
    const songs = await knex.select('*')
      .from('songs')
      .where('title', 'ilike', `%${search}%`)
      .orWhere('artist', 'ilike', `%${search}%`);

    // console.log('Resultado de la consulta:', songs);
    return songs;
  } catch (error) {
    console.error('Error al realizar la búsqueda de canciones:', error); // Agrega un mensaje de error en caso de que ocurra un error
    throw new Error('Error al realizar la búsqueda de canciones.');
  }
};

// Agrega una canción a la Playlist.
const addSongToPlaylist = async (song_id, playlist_id) => {
  await knex('playlist_song').insert({
    song_id: song_id,
    playlist_id: playlist_id,
  });
};
// Elimina una cancion de la playlists.
const removeSongFromPlaylist = (song_id, playlist_id) => {
  return knex('playlist_song')
    .where('song_id', song_id)
    .where('playlist_id', playlist_id)
    .del();
};

//=== Playlists ===//
// Agrega una playlist a un usuario especifico.
const addPlaylist = (id, playlist_name) => {
  return knex('playlists')
    .insert({
      user_id: id,
      name: playlist_name,
    })
    .returning('id'); // Especificamos que queremos obtener el ID generado
};
// Elimina una playlist.
const removePlaylist = async (id, playlist_id) => {
  await knex('playlist_song').where('playlist_id', playlist_id).del();
  await knex('playlists').where('user_id', id).where('id', playlist_id).del();
};

//=== Verificaciones ===//
// Verifica que exista la playlist y que pertenezca al usuario.
const doesPlaylistExist = async (playlist_id, id) => {
  const playlist = await knex
    .select('*')
    .from('playlists as pl')
    .join('users as us', 'pl.user_id', 'us.id')
    .where('pl.id', playlist_id)
    .where('us.id', id)
    .first();
  return !!playlist;
};
// Verificar si un song_id ingresado existe en la tabla songs.
const doesSongExist = async (song_id) => {
  const song = await knex('songs').where('id', song_id).first();
  return song !== undefined;
};
// Verifica si una canción ya existe en dicha playlist.
const isSongAddedInPlaylist = async (song_id, playlist_id) => {
  const musicExists = await knex('playlist_song')
    .select('*')
    .where('song_id', song_id)
    .where('playlist_id', playlist_id);

  return musicExists.length > 0 ? true : false;
};

module.exports = {
  getUserPlaylistData,
  getAllSongs,
  searchSongs,
  doesPlaylistExist,
  doesSongExist,
  isSongAddedInPlaylist,
  addSongToPlaylist,
  addPlaylist,
  removePlaylist,
  removeSongFromPlaylist,
};
