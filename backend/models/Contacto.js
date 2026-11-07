const mongoose = require('mongoose');

const contactoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            maxlength: [80, 'El nombre no puede superar los 80 caracteres']
        },
        apellido: {
            type: String,
            required: [true, 'El apellido es obligatorio'],
            trim: true,
            maxlength: [80, 'El apellido no puede superar los 80 caracteres']
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            trim: true,
            lowercase: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no tiene un formato válido']
        },
        fechaNacimiento: {
            type: Date,
            required: [true, 'La fecha de nacimiento es obligatoria']
        },
        genero: {
            type: String,
            enum: {
                values: ['otro', 'hombre', 'mujer'],
                message: 'El género debe ser otro, hombre o mujer'
            },
            default: 'otro'
        },
        titulo: {
            type: String,
            required: [true, 'El título es obligatorio'],
            trim: true,
            maxlength: [150, 'El título no puede superar los 150 caracteres']
        },
        mensaje: {
            type: String,
            required: [true, 'El mensaje es obligatorio'],
            trim: true,
            maxlength: [2000, 'El mensaje no puede superar los 2000 caracteres']
        }
    },
    {
        timestamps: true,
        collection: 'contactos'
    }
);

module.exports = mongoose.model('Contacto', contactoSchema);
