const express = require('express');
const Contacto = require('../models/Contacto');
const { limiteContacto } = require('../middleware/limites');

const router = express.Router();

router.post('/', limiteContacto, async (req, res) => {
    try {
        const { nombre, apellido, email, fechaNacimiento, genero, titulo, mensaje } = req.body;

        if (!nombre || !apellido || !email || !fechaNacimiento || !titulo || !mensaje) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Faltan campos obligatorios'
            });
        }

        const contacto = await Contacto.create({
            nombre,
            apellido,
            email,
            fechaNacimiento,
            genero,
            titulo,
            mensaje
        });

        return res.status(201).json({
            ok: true,
            mensaje: '¡Mensaje guardado correctamente!',
            id: contacto._id
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const errores = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({
                ok: false,
                mensaje: 'Datos inválidos',
                errores
            });
        }

        console.error('Error guardando contacto:', error);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al guardar el mensaje'
        });
    }
});

module.exports = router;
