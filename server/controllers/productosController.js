const express = require('express');
const _ = require('underscore');
let { verificaToken } = require('../middlewares/authentication');

let app = express();

let Producto = require('../models/producto');
let productosPutValidators = { new: true, runValidators: true };

app.get("/productos", verificaToken, (req, res) => {
    Producto.find({ disponible: true })
        .populate('usuario', ['nombre', 'email'])
        .populate('categoria')
        .sort("descripcion")
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });

        });
});

app.get("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB || !productoDB.disponible) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "El producto no existe"
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.post("/productos", verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

app.put("/productos/:id", verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni']);

    Producto.findByIdAndUpdate(id, body, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "La categoria no existe"
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    })
});

app.delete("/productos/:id", verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, { 'disponible': false }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "La categoria no existe"
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    })

});



module.exports = app;