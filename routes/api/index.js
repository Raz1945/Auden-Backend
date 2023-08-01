const express = require('express');
const router = express.Router();

const auden = require('./auden');

router.use('/', auden);

// http://localhost:3005/api/ping3
router.get('/ping3', (_req, res) => {
  console.log('API: someone pinged here!! ');
  res.send('pong pong pong');
});

module.exports = router;