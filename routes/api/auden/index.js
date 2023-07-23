const express = require('express');
const router = express.Router();

//? Aqui van los diferentes Endpoints
const crudRouter = require('./crud');

router.use('/', crudRouter);

// * prueba
// http://localhost:3005/api/pum
router.get('/pum', (_req, res) => {
  console.log('AUDEN: someone pinged here!! ');
  res.send('pum!');
});

module.exports = router;
