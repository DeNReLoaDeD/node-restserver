const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

let Usuario = require('../models/usuario');
let Producto = require('../models/producto');

// default options
app.use(fileUpload());

app.post('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "No se ha seleccionado ningun archivo"
            }
        });
    }

    let tiposValidos = ['producto', 'usuario'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "La tiposValidos no es valida"
            }
        });
    }

    let archivo = req.files.archivo;
    let archivoName = archivo.name.split('.');
    let extension = archivoName[1];

    let extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: "La extension no es valida"
            }
        });
    }

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuario') {
            imagenUsuario(id, res, nombreArchivo, tipo);
        } else if (tipo === 'producto') {
            imagenProducto(id, res, nombreArchivo, tipo);
        }

    });
});

function imagenUsuario(id, res, nombreArchivo, tipo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: "usuario inexistente"
                }
            });
        }

        borraArchivo(usuarioDB.img, tipo);

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, user) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                usuario: user
            })
        });


    });
}

function imagenProducto(id, res, nombreArchivo, tipo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, tipo);
            return res.status(400).json({
                ok: false,
                err: {
                    message: "producto inexistente"
                }
            });
        }

        borraArchivo(productoDB.img, tipo);

        productoDB.img = nombreArchivo;

        productoDB.save((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: product
            })
        });


    });

}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;