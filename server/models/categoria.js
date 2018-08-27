const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        required: [true, 'descripcion is required']
    },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' }
});

module.exports = mongoose.model('categoria', categoriaSchema);