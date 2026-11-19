const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRA = process.env.JWT_EXPIRA || '7d';

if (!JWT_SECRET) {
    console.warn('JWT_SECRET no está configurado: el registro y el login no funcionarán.');
}

// Crea un token firmado con el ID del usuario.
function crearToken(usuario) {
    if (!JWT_SECRET) {
        throw new Error('Falta configurar JWT_SECRET en backend/.env');
    }

    return jwt.sign(
        { sub: usuario._id.toString() },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRA }
    );
}

// Verifica que el token sea válido y no haya expirado.
function verificarToken(token) {
    if (!JWT_SECRET) {
        throw new Error('Falta configurar JWT_SECRET en backend/.env');
    }

    return jwt.verify(token, JWT_SECRET);
}

module.exports = { crearToken, verificarToken };
