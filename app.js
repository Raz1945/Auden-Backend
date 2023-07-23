require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.APP_PORT || 3005;
const routes = require('./routes');
const middlewares = require('./middlewares');

app.use(cors());
app.options('*', cors()); // permite que cualquer ruta acceder sin ser bloqueada por el nav.

app.use(express.json()); // Para trabajara con los datos en formato json

app.use(middlewares);

app.use('/', routes);

app.listen(port, () => {
  console.log(`La app se ejecuta en el http://localhost:${port}`);
});
