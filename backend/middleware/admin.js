function requerirAdmin(req, res, next) {
    if (req.usuario?.rol !== 'admin') {
        return res.status(403).json({
            ok: false,
            mensaje: 'No tenés permisos para acceder a esta sección'
        });
    }

    return next();
}

module.exports = { requerirAdmin };