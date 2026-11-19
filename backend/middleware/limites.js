const rateLimit = require('express-rate-limit');

const limiteAuth = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        mensaje: 'Demasiados intentos. Esperá 15 minutos y volvé a probar.'
    }
});

const limiteContacto = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        ok: false,
        mensaje: 'Recibimos demasiados mensajes desde esta conexión. Probá más tarde.'
    }
});

module.exports = { limiteAuth, limiteContacto };