//========
// Puerto
//========
process.env.PORT = process.env.PORT || 3000;

//========
// Entorno
//========
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//========
// Token data
//========
process.env.CADUCIDAD_TOKEN = 6000 * 6000
process.env.SEED = process.env.SEED || 'secret-dev'


//========
// DB
//========
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;