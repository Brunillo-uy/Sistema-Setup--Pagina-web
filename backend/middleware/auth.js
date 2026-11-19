const Usuario = require('../models/Usuario');
const { verificarToken } = require('../config/auth');

// Protege rutas que necesitan un usuario autenticado.
async function requerirAutenticacion(req, res, next) {
    const cabecera = req.headers.authorization || '';
    const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7).trim() : '';

    if (!token) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Debes iniciar sesión para continuar'
        });
    }

    try {
        const datos = verificarToken(token);
        const usuario = await Usuario.findById(datos.sub);

        if (!usuario) {
            return res.status(401).json({
                ok: false,
                mensaje: 'La sesión ya no es válida'
            });
        }

        if (usuario.activo === false) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Tu cuenta está desactivada'
            });
        }

        req.usuario = usuario;
        return next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            mensaje: 'La sesión expiró o el token no es válido'
        });
    }
}

module.exports = { requerirAutenticacion };
