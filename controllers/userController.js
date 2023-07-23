const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const userModel = require('../models/userServices');
const userService = require('../models/userServices');

// Para ver los usuarios creados y su respectiva informacion
exports.getInfoUser = async (_, res) => {
  try {
    const users = await userService.getUsers();

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios.' });
    }
    const usersFiltered = users.map(({ email, user }) => {
      return { email, user };
    });

    res.json(usersFiltered);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos solicitados.' });
  }
};

// De momento solo se loguea con el mail
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

    const data = { email: email };

    // Encuentro el usuario
    const user = await userModel.findUserByEmail(data); //? Se usa data y no email, para respetar la query
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
        // Respuesta exitosa del servidor
        console.log('Inicio de sesión exitoso para el usuario:', user.email);

        return res.status(200).json({
          message: 'Inicio de sesión exitoso',
          user: {
            id: user.id,
            email: user.email,
            // Otros datos del usuario que se quiera enviar
          },
          // Enviar el token en la respuestaF
          accessToken,
        });
      }
    }

    return res.status(401).json({ message: 'Usuario y/o clave inválida.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos solicitados.' });
  }
};

exports.register = async (req, res) => {
  try {
    const { email, user, password, repassword } = req.body;

    // Valido que las constraseñas sean iguales
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
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Compruebo si existe el usuario.
    const existingUser = await userModel.findUserByEmail({ email });
    if (existingUser) {
      console.log('El usuario ya existe.');
      return res.status(400).json({ error: 'Error al crear el usuario.' });
    }

    // Encripto el password
    const salt = await bcrypt.genSalt(10);
    const encriptedPassword = await bcrypt.hash(password, salt);

    console.log('Salt:', salt); //! borrar
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

// * Ver si tiene que funcionar, ya que deberai de enviar un mail con una claver
exports.forgotPassword = async (req, res) => {
  try {
    const { email, password, repassword } = req.body;

    // Valido que las constraseñas sean iguales
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
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .run(req),
    ]);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Compruebo si existe el usuario.
    const existingUser = await userModel.findUserByEmail({ email });
    if (existingUser) {
      console.log('El usuario ya existe.');
      return res.status(400).json({ error: 'Error al crear el usuario.' });
    }

    // Encripto el password
    const salt = await bcrypt.genSalt(10);
    const encriptedPassword = await bcrypt.hash(password, salt);

    const data = {
      email: email,
      user: user,
      password: encriptedPassword,
    };

    const newUser = await userModel.createUser(data);

    const message = 'El registro ha sido actualizado con éxito';
    res.json({ message, newUser }); //! Borrar el newUser
  } catch (error) {}
};
