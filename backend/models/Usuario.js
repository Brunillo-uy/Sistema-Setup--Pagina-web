const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
            maxlength: [80, 'El nombre no puede superar los 80 caracteres']
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            trim: true,
            lowercase: true,
            unique: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'El email no tiene un formato válido']
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
            select: false
        },
        rol: {
            type: String,
            enum: ['usuario', 'admin'],
            default: 'usuario'
        },
        activo: {
            type: Boolean,
            default: true
        },
        ultimoAcceso: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true,
        collection: 'usuarios'
    }
);

// Hashea la contraseña solo cuando se crea o se cambia.
usuarioSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const sal = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, sal);
});

// Compara la contraseña escrita por el usuario con la guardada.
usuarioSchema.methods.compararPassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Nunca devuelve la contraseña en las respuestas JSON.
usuarioSchema.methods.toJSON = function () {
    const usuario = this.toObject();
    delete usuario.password;
    return usuario;
};

module.exports = mongoose.model('Usuario', usuarioSchema);
