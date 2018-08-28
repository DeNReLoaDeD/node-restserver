const jwt = require('jsonwebtoken');

//verificar token
let verificaToken = (req, res, next) => {
    //leer parametro del header
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }
        req.usuario = decode.usuario;
        next();
    });
};

let verificaRole = (req, res, next) => {
    let role = req.usuario.role;

    if (role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es un administrador'
            }
        });
    }

}

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decode) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            });
        }
        req.usuario = decode.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaRole,
    verificaTokenImg
}