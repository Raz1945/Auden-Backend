const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const userModel = require('../models/userServices');
const userService = require('../models/userServices');


exports.getUsersWithoutSensitiveInfo = async (_, res) => {
  try {
    const allUsers = await userService.getUser();
    const UserWithoutSensitiveInfo = allUsers.map(({ email, user }) => {
      return { email, user };
    });

    res.json(UserWithoutSensitiveInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos solicitados.' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validaciones de entrada
    await Promise.all([
      body('email')
        .notEmpty()
        .withMessage('El campo de correo electrónico no puede estar vacío')
        .isEmail()
        .withMessage(
          'El campo de correo electrónico debe ser una dirección de correo válida'
        )
        .normalizeEmail()
        .withMessage(
          'El campo de correo electrónico debe estar en un formato válido'
        )
        .run(req),

      body('password')
        .notEmpty()
        .withMessage('El campo de contraseña no puede estar vacío')
        .run(req),
    ]);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const data = {
      email: email,
    };

    // Encuentro el usuario
    const user = await userModel.findUser(data); //? Se usa data y no email, para respetar la query
    if (user) {
      // Verificar si las contraseñas coinciden
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        // Generar token JWT con información adicional
        const accessToken = jwt.sign(
          {
            id: user.id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
          }
        );
        // Enviar el token en la respuesta
        return res.json({ accessToken });
      }
    }

    return res.status(401).send('Usuario y/o clave inválida.');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos solicitados.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { email, user, password, repassword } = req.body;

    if (password !== repassword) {
      return res
        .status(400)
        .json({ error: 'Las contraseñas deben ser iguales' });
    }
    // Validaciones de entrada
    await Promise.all([
      body('email')
        .notEmpty()
        .withMessage('El campo de correo electrónico no puede estar vacío')
        .isEmail()
        .withMessage(
          'El campo de correo electrónico debe ser una dirección de correo válida'
        )
        .normalizeEmail()
        .withMessage(
          'El campo de correo electrónico debe estar en un formato válido'
        )
        .run(req),

      body('password')
        .notEmpty()
        .withMessage('El campo de contraseña no puede estar vacío')
        .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Compruebo si existe el usuario.
    const existingUser = await userModel.findUser({ email });
    if (existingUser) {
      console.log('El usuario ya existe.');
      return res.status(400).json({ error: 'Error al crear el usuario.' });
    }

    // Encripto el password
    const salt = await bcrypt.genSalt(10);
    const encriptedPassword = await bcrypt.hash(password, salt);

    console.log('Salt::', salt); //! borrar
    console.log('La contraseña es:', encriptedPassword); //! borrar

    const data = {
      email: email,
      user: user,
      password: encriptedPassword,
    };

    const newUser = await userModel.createUser(data);

    const message = 'El registro ha sido creado con éxito';
    res.json({ message, newUser }); //! Borrar el newUser
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el usuario.' });
  }
};
