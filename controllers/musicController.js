const musicModel = require('../models/musicServices');

// Obtiene una lista con todas las canciones
exports.getAllSongs = async (_req, res) => {
  try {
    const all = await musicModel.getAllSongs();
    const allMusic = all.map(({ artist, title, duration, genre, rating }) => {
      return { title, artist, duration, rating, genre };
    });

    res.json(allMusic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos solicitados.' });
  }
};

// Obtiene informacion sobre las playslist de un usuario especifico
exports.getUserPlaylist = async (req, res) => {
  try {
    const id = req.user.id;

    const data = await musicModel.getUserPlaylistData(id);

    console.log(data[0]?.user ?? 'No existe ningina playlist');
    console.log(data);

    if (data.length < 1) {
      console.log(data);
      return res.json({ playlists: [] });
    }

    // Procesar los resultados para agrupar las canciones por listas de reproducción
    const formattedResult = data.reduce((acc, row) => {
      //? acc es el 'acumulador', se está utilizando para acumular los datos formateados y organizarlos en la estructura deseada.

      // Extraer los datos de la fila actual del resultado
      const {
        song_id,
        playlist_id,
        user,
        playlist,
        title,
        duration,
        artist,
        rating,
      } = row;

      // Si el usuario aún no está en el acumulador, agregarlo con una lista de reproducción vacía
      if (!acc[user]) {
        acc[user] = { playlists: [] };
      }

      // Encontrar el índice de la lista de reproducción actual dentro de las playlists del usuario
      let playlistIndex = acc[user].playlists.findIndex(
        (pl) => pl.id === playlist_id
      );
      console.log(playlist_id);

      // Si la lista de reproducción actual no está en el acumulador, agregarla con una lista de canciones vacía
      if (playlistIndex === -1) {
        acc[user].playlists.push({
          id: playlist_id,
          name: playlist,
          songs: [],
        });
        playlistIndex = acc[user].playlists.length - 1; // Actualizamos el índice después de agregar la nueva playlist
      }

      if (song_id !== null) {
        // Agregar la canción actual a la lista de canciones de la lista de reproducción actual
        acc[user].playlists[playlistIndex].songs.push({
          id: song_id,
          title,
          duration,
          artist,
          rating,
        });
      }
      return acc; // Devolver el acumulador actualizado para la siguiente iteración
    }, {}); // Iniciar el acumulador como un objeto vacío

    res.json(formattedResult[data[0].user]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos solicitados.' });
  }
};

// Agrega una cancion a una playlist.
exports.addSongToUserPlaylist = async (req, res) => {
  try {
    const id = req.user.id;

    const { song_id, playlist_id } = req.body;

    // Verificar si el playlist_id existe en la tabla playlists y que corresponda al usuario indicado
    const playlistExists = await musicModel.doesPlaylistExist(playlist_id, id);
    if (!playlistExists) {
      return res.status(404).json({
        error: 'El playlist_id proporcionado no existe en la tabla playlists.',
      });
    }

    // Verificar si el song_id existe en la tabla songs
    const songExists = await musicModel.doesSongExist(song_id);
    if (!songExists) {
      return res.status(404).json({
        error: 'El song_id proporcionado no existe en la tabla songs.',
      });
    }

    //  Verifica si existe ya en la playlists
    const songExistsInPlaylist = await musicModel.isSongAddedInPlaylist(
      song_id,
      playlist_id
    );
    if (songExistsInPlaylist.length > 0) {
      return res.status(400).json({
        error: 'La canción ya existe en la playlist.',
      });
    }

    // Realizar la inserción en la tabla playlist_song
    await musicModel.addSongToPlaylist(song_id, playlist_id);

    return res.json({ message: 'El registro añadido con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al añadir.' });
  }
};

// Elimina una cancion de una playlist.
exports.removeSongToUserPlaylist = async (req, res) => {
  try {
    const id = req.user.id;
    const { song_id, playlist_id } = req.body;

    // Verificar si el playlist_id existe en la tabla playlists y que corresponda al usuario indicado
    const playlistExists = await musicModel.doesPlaylistExist(playlist_id, id);
    if (!playlistExists) {
      return res.status(404).json({
        error: 'El playlist_id proporcionado no existe en la tabla playlists.',
      });
    }

    // Verificar si el song_id existe en la tabla songs
    const songExists = await musicModel.doesSongExist(song_id);
    if (!songExists) {
      return res.status(404).json({
        error: 'El song_id proporcionado no existe en la tabla songs.',
      });
    }

    //  Verifica si existe la cancion en la playlists
    const songExistsInPlaylist = await musicModel.isSongAddedInPlaylist(
      song_id,
      playlist_id
    );
    if (!songExistsInPlaylist) {
      return res.status(400).json({
        error: 'La canción no existe en la playlist indicada.',
      });
    }

    // Elimina la cancion indicada
    await musicModel.removeSongFromPlaylist(song_id, playlist_id);

    return res.json({ message: 'El registro eliminado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar.' });
  }
};

// Agrega una playlist.
exports.addPlaylistToUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { playlist_name } = req.body;

    // Realizar la creacion de una playlist
    await musicModel.addPlaylist(id, playlist_name);

    return res.json({ message: 'El registro ha sido añadido con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al añadir.' });
  }
};

exports.addPlaylistWithSongsToUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { playlist_name, songs } = req.body;

    // Realizar la creacion de una playlist
    const newPlaylistId = await musicModel.addPlaylist(id, playlist_name);

    console.log(newPlaylistId[0].id);

    const uniqueSongs = [...new Set(songs)];

    // Verifico que cada cancion exita
    for (let index = 0; index < uniqueSongs.length; index++) {
      const song_id = uniqueSongs[index];

      try {
        // Verificar si el song_id existe en la tabla songs
        const songExists = await musicModel.doesSongExist(song_id);

        if (songExists) {
          // Realizar la inserción en la tabla playlist_song
          await musicModel.addSongToPlaylist(song_id, newPlaylistId[0].id);
        }
      } catch (error) {
        console.log('\x1b[31m\x1b[0m', 'Error:', error);
      }
    }

    return res.json({ message: 'El registro ha sido añadido con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al añadir.' });
  }
};
// Elimina una playlist.
exports.removePlaylistToUser = async (req, res) => {
  try {
    const id = req.user.id;
    const { playlist_id } = req.body;

    // Verificar si el playlist_id existe en la tabla playlists y que corresponda al usuario indicado
    const playlistExists = await musicModel.doesPlaylistExist(playlist_id, id);
    if (!playlistExists) {
      return res.status(404).json({
        error: 'El playlist_id proporcionado no existe en la tabla playlists.',
      });
    }

    // Elimina la playlists indicada
    await musicModel.removePlaylist(id, playlist_id);
    


    return res.json({ message: 'El registro eliminado con éxito.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar.' });
  }
};
