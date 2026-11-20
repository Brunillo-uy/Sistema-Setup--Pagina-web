const express = require('express');
const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const router = express.Router();

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

router.get('/filtros', async (req, res) => {
    try {
        const [categorias, marcas, rango] = await Promise.all([
            Producto.aggregate([
                { $group: { _id: '$categoria', total: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Producto.aggregate([
                { $group: { _id: '$marca', total: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ]),
            Producto.aggregate([
                { $group: { _id: null, minimo: { $min: '$precio' }, maximo: { $max: '$precio' } } }
            ])
        ]);

        return res.json({
            ok: true,
            total: categorias.reduce((suma, c) => suma + c.total, 0),
            categorias: categorias.map((c) => ({ valor: c._id, total: c.total })),
            marcas: marcas.map((m) => ({ valor: m._id, total: m.total })),
            precioMin: rango[0]?.minimo ?? 0,
            precioMax: rango[0]?.maximo ?? 0
        });
    } catch (error) {
        console.error('Error obteniendo filtros de productos:', error);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al obtener los filtros'
        });
    }
});

router.get('/', async (req, res) => {
    try {
        const { categoria, marcas, chipset, precioMin, precioMax, buscar, orden } = req.query;
        const filtro = {};

        if (categoria) {
            filtro.categoria = String(categoria).toLowerCase();
        }

        if (marcas) {
            const listaMarcas = String(marcas)
                .split(',')
                .map((m) => m.trim().toLowerCase())
                .filter(Boolean);

            if (listaMarcas.length > 0) {
                filtro.marca = { $in: listaMarcas };
            }
        }

        if (chipset) {
            const listaChipsets = String(chipset)
                .split(',')
                .map((c) => c.trim().toLowerCase())
                .filter(Boolean);

            if (listaChipsets.length > 0) {
                filtro.chipset = { $in: listaChipsets };
            }
        }

        if (precioMin !== undefined || precioMax !== undefined) {
            filtro.precio = {};

            if (precioMin !== undefined && precioMin !== '') {
                filtro.precio.$gte = Number(precioMin);
            }

            if (precioMax !== undefined && precioMax !== '') {
                filtro.precio.$lte = Number(precioMax);
            }
        }

        if (buscar) {
            const patron = new RegExp(escaparRegex(String(buscar)), 'i');
            filtro.$or = [{ nombre: patron }, { marca: patron }, { descripcion: patron }];
        }

        const ordenes = {
            'precio-asc': { precio: 1 },
            'precio-desc': { precio: -1 },
            nombre: { nombre: 1 }
        };

        const productos = await Producto.find(filtro)
            .sort(ordenes[orden] || { nombre: 1 })
            .lean();

        return res.json({
            ok: true,
            total: productos.length,
            productos
        });
    } catch (error) {
        console.error('Error listando productos:', error);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al obtener los productos'
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ID del producto no es válido'
            });
        }

        const producto = await Producto.findById(id).lean();

        if (!producto) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Producto no encontrado'
            });
        }

        return res.json({ ok: true, producto });
    } catch (error) {
        console.error('Error obteniendo el producto:', error);
        return res.status(500).json({
            ok: false,
            mensaje: 'Error interno del servidor al obtener el producto'
        });
    }
});

module.exports = router;
