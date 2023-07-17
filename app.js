require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.APP_PORT || 3005;

const routes = require('./routes');
const middlewares = require('./middlewares');

// Para trabajara con los datos en formato json
app.use(express.json());

app.use(middlewares);

app.use('/', routes);

app.listen(port, () => {
  console.log(`La app se ejecuta en el http://localhost:${port}`);
});
