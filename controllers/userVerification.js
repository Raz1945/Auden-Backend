const userService = require('../models/userServices');

const mostrarUsuariosRegistrados = async () => {
  try {
    const users = await userService.getUsers();

    if (!users || users.length === 0) {
      console.log('No hay usuarios registrados en la base de datos.');
    } else {
      console.log('Usuarios registrados en la base de datos:');
      users.forEach((user) => {
        console.log('ID :', user.id);
        console.log('Nombre:', user.user);
        console.log('Email:', user.email);
        console.log('password:', user.password);
        console.log('-----------------------');
      });
    }
  } catch (error) {
    console.error('Error al obtener información de los usuarios:', error);
  }
};

module.exports = mostrarUsuariosRegistrados;
