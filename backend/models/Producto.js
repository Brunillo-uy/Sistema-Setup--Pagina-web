const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio'],
            trim: true,
            maxlength: [150, 'El nombre no puede superar los 150 caracteres']
        },
        marca: {
            type: String,
            required: [true, 'La marca es obligatoria'],
            trim: true,
            lowercase: true
        },
        categoria: {
            type: String,
            required: [true, 'La categoría es obligatoria'],
            trim: true,
            lowercase: true
        },
        chipset: {
            type: String,
            trim: true,
            lowercase: true
        },
        precio: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            min: [0, 'El precio no puede ser negativo']
        },
        moneda: {
            type: String,
            default: 'US$',
            trim: true
        },
        imagen: {
            type: String,
            default: ''
        },
        descripcion: {
            type: String,
            trim: true,
            maxlength: [2000, 'La descripción no puede superar los 2000 caracteres']
        },
        caracteristicas: {
            type: [{
                type: String,
                trim: true,
                maxlength: [500, 'Cada característica no puede superar los 500 caracteres']
            }],
            default: []
        },
        socket: {
            type: String,
            trim: true
        },
        nucleos: {
            type: String,
            trim: true
        },
        stock: {
            type: Number,
            default: 0,
            min: [0, 'El stock no puede ser negativo']
        }
    },
    {
        timestamps: true,
        collection: 'productos'
    }
);

productoSchema.index({ categoria: 1, marca: 1, precio: 1 });

module.exports = mongoose.model('Producto', productoSchema);
