const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/authentication');


let app = express();

app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let pathNoImagen = path.resolve(__dirname, `../assets/imagentest.png`);

    if (fs.existsSync(pathImagen)) {
        return res.sendFile(pathImagen);
    } else {
        return res.sendFile(pathNoImagen);
    }

    res.sendFile(pathNoImagen);

});

module.exports = app;