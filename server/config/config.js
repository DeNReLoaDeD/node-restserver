//========
// Puerto
//========
process.env.PORT = process.env.PORT || 3000;

//========
// Entorno
//========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//========
// DB
//========
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://cafeuser:123456d@ds125342.mlab.com:25342/cafe-dev';
}

process.env.URLDB = urlDB;