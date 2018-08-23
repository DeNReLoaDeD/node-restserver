const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verificaToken, verificaRole } = require('../middlewares/authentication');

let userPutValidators = { new: true, runValidators: true };

app.get('/usuarios', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    let limit = req.query.limit || 5;

    Usuario.find({ status: true }, 'nombre email status role')
        .skip(Number(desde))
        .limit(Number(limit))
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ status: true }, (err, count) => {

                res.json({
                    ok: true,
                    usuarios,
                    count
                });
            })

        })




});

app.post("/usuarios", verificaToken, (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});

app.put("/usuarios/:id", [verificaToken, verificaRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, userPutValidators, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })

});

app.delete("/usuarios/:id", [verificaToken, verificaRole], (req, res) => {

    let id = req.params.id;
    let cambiaEstado = {
        status: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, userPutValidators, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    })
});

module.exports = app;