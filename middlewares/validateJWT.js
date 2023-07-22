const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Obtener el token de la solicitud
  const token =
    req.body.token || req.query.token || req.headers['x-access-token'];

  // Verificar si el token existe
  if (!token) {
    return res.status(401).json({message:'Acceso denegado.'});
  }

  try {
    // Verificar el token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Modificar la solicitud para agregar la información del usuario
    req.user = verified;

    // Continuar con la siguiente función de middleware
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'El token no es válido.' });
  }
};

module.exports = verifyToken;
