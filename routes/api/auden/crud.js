const express = require('express');
const router = express.Router();

// Ruta con sus respectivos controladores.
const musicController = require('../../../controllers/musicController');
const userController = require('../../../controllers/userController');
const verifyToken = require('../../../middlewares/validateJWT');

router.get('/flow', verifyToken, musicController.getUserPlaylist); // Obtiene informacion sobre la/las playslist de un usuario especifico.

router.post('/flow/addPlaylist', verifyToken, musicController.addPlaylistToUser); // Agrega una playlist.
router.post('/flow/addPlaylistWithSongs', verifyToken, musicController.addPlaylistWithSongsToUser); // Agrega una playlist.

// router.put('/flow/updatePlaylist', verifyToken, musicController.updateUserPlaylist);
router.delete('/flow/removePlaylist', verifyToken, musicController.removePlaylistToUser); // Elimina una playlist.


router.get('/flow/songs', musicController.getAllSongs); // Obtiente una lista con todas las canciones o filtra por término de búsqueda.
router.post('/flow/addSong', verifyToken, musicController.addSongToUserPlaylist); // Agrega una cancion a la playlist.
router.delete('/flow/removeSong', verifyToken, musicController.removeSongToUserPlaylist); // Elimina una cancion de una playlist.


router.get('/all', userController.getInfoUser); // es solo para ver los usuarios y sus mails

router.post('/login', userController.login);
router.post('/register', userController.register);
// router.post('/forgot-password', userController.forgotPassword);

router.post('/checkUsernameAvailability', userController.checkUsernameAvailability);

module.exports = router;



