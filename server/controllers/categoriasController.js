const express = require('express');
const _ = require('underscore');
let { verificaToken, verificaRole } = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');
let categoriasPutValidators = { new: true, runValidators: true };

//muestra todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .populate('usuario', ['nombre', 'email'])
        .sort("descripcion")
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias: categorias
            });

        });
});

//muestra categoria por id
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "La categoria no existe"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//actualiza categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);

    Categoria.findByIdAndUpdate(id, body, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "La categoria no existe"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })
});

//elimina fisicamente categoria
app.delete('/categoria/:id', [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;

    //solo admin puede borrar categorias
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "La categoria no existe"
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })


});

module.exports = app;