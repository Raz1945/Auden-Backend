const express = require('express');
const router = express.Router();

const api = require('./api');

router.use('/api', api);

// http://localhost:3005/ping2
router.get('/ping2', (_req, res) => {
  console.log('ROUTES: someone pinged here!! ');
  res.send('pong pong');
});

module.exports = router;
