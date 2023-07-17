const express = require('express');
const router = express.Router();

//? Ruta con sus respectivos controladores.
const musicController = require('../../../controllers/musicController');
const userController = require('../../../controllers/userController');
// const verifyToken = require('../../../middlewares/validateJWT');

//? Musica
router.get('/', musicController.getAll);

//? Usuario
router.post('/login', userController.login);

router.post('/sign_up', userController.create);

module.exports = router;
