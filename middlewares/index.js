const express = require('express');
const router = express.Router();

// Registra la información de las solicitudes entrantes
router.use((req, _res, next) => {
  const formattedTime = new Date().toLocaleString();
  console.info('\x1b[36m%s\x1b[0m', 'Time:', formattedTime);
  console.log('\x1b[35m%s\x1b[0m', 'Request URL:', req.originalUrl);
  console.log('\x1b[35m%s\x1b[0m', 'Request Type:', req.method);
  next();
});

router.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({'error':'Something broke!'});
});

// Retraso de 1 seg antes de pasar a otro middlewares o controlador
router.use((_req, _res, next) => {
  setTimeout(next, 1000);
});

module.exports = router;
