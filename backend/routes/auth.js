const express = require('express');
const Usuario = require('../models/Usuario');
const { crearToken } = require('../config/auth');
const { requerirAutenticacion } = require('../middleware/auth');
const { limiteAuth } = require('../middleware/limites');

const router = express.Router();

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Devuelve solo los datos públicos del usuario.
function usuarioPublico(usuario) {
    return {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol || 'usuario',
        activo: usuario.activo !== false,
        creadoEn: usuario.createdAt,
        ultimoAcceso: usuario.ultimoAcceso
    };
}

// POST /api/auth/registro -> crea una cuenta nueva.
router.post('/registro', limiteAuth, async (req, res) => {
    try {
        const nombre = (req.body.nombre || '').trim();
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';

        if (!nombre || !email || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Nombre, email y contraseña son obligatorios'
            });
        }

        if (nombre.length < 2) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El nombre debe tener al menos 2 caracteres'
            });
        }

        if (!EMAIL_VALIDO.test(email)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El email no tiene un formato válido'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        const existente = await Usuario.findOne({ email }).lean();

        if (existente) {
            return res.status(409).json({
                ok: false,
                mensaje: 'Ya existe una cuenta con ese email'
            });
        }

        // El registro público siempre crea clientes, nunca administradores.
        const usuario = await Usuario.create({
            nombre,
            email,
            password,
            rol: 'usuario',
            activo: true
        });

        return res.status(201).json({
            ok: true,
            mensaje: '¡Cuenta creada correctamente!',
            token: crearToken(usuario),
            usuario: usuarioPublico(usuario)
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                ok: false,
                mensaje: 'Ya existe una cuenta con ese email'
            });
        }

        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                ok: false,
                mensaje: errores[0] || 'Datos inválidos',
                errores
            });
        }

        console.error('Error registrando usuario:', error);
        return res.status(500).json({
            ok: false,
            mensaje: 'No se pudo crear la cuenta. Intenta de nuevo.'
        });
    }
});

// POST /api/auth/login -> valida email y contraseña.
router.post('/login', limiteAuth, async (req, res) => {
    try {
        const email = (req.body.email || '').trim().toLowerCase();
        const password = req.body.password || '';

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Email y contraseña son obligatorios'
            });
        }

        const usuario = await Usuario.findOne({ email }).select('+password');

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        const coincide = await usuario.compararPassword(password);

        if (!coincide) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Email o contraseña incorrectos'
            });
        }

        if (usuario.activo === false) {
            return res.status(403).json({
                ok: false,
                mensaje: 'Tu cuenta está desactivada. Contactá al administrador.'
            });
        }

        usuario.ultimoAcceso = new Date();
        await usuario.save();

        return res.json({
            ok: true,
            mensaje: '¡Bienvenido de nuevo!',
            token: crearToken(usuario),
            usuario: usuarioPublico(usuario)
        });
    } catch (error) {
        console.error('Error iniciando sesión:', error);
        return res.status(500).json({
            ok: false,
            mensaje: 'No se pudo iniciar sesión. Intenta de nuevo.'
        });
    }
});

// GET /api/auth/perfil -> devuelve el usuario dueño del token.
router.get('/perfil', requerirAutenticacion, (req, res) => {
    return res.json({
        ok: true,
        usuario: usuarioPublico(req.usuario)
    });
});

// POST /api/auth/logout -> el token se elimina en el navegador.
router.post('/logout', (req, res) => {
    return res.json({
        ok: true,
        mensaje: 'Sesión cerrada correctamente'
    });
});

module.exports = router;
