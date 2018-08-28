const express = require('express');
const app = express();

app.use(require('./usuariosController'));
app.use(require('./categoriasController'));
app.use(require('./productosController'));
app.use(require('./uploadController'));
app.use(require('./imagesController'));
app.use(require('./login'));

module.exports = app;