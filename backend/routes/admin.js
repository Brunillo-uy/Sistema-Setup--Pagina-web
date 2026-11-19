const express = require('express');
const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const Contacto = require('../models/Contacto');
const { requerirAutenticacion } = require('../middleware/auth');
const { requerirAdmin } = require('../middleware/admin');

const router = express.Router();

// Todas las rutas del panel exigen sesión y rol de administrador.
router.use(requerirAutenticacion, requerirAdmin);

const ESTADOS_CONTACTO = ['nuevo', 'leido', 'respondido'];
const ROLES = ['usuario', 'admin'];

const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function obtenerPaginacion(req, limitePorDefecto = 10) {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || limitePorDefecto));

    return {
        page,
        limit,
        salto: (page - 1) * limit
    };
}

function usuarioAdmin(usuario) {
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

function datosProducto(body) {
    const datos = {};
    const camposTexto = [
        'nombre',
        'marca',
        'categoria',
        'chipset',
        'moneda',
        'imagen',
        'descripcion',
        'socket',
        'nucleos'
    ];

    camposTexto.forEach((campo) => {
        if (body[campo] !== undefined) {
            datos[campo] = String(body[campo]).trim();
        }
    });

    if (datos.marca) datos.marca = datos.marca.toLowerCase();
    if (datos.categoria) datos.categoria = datos.categoria.toLowerCase();
    if (!datos.moneda) datos.moneda = 'US$';

    if (body.precio !== undefined) datos.precio = Number(body.precio);
    if (body.stock !== undefined) datos.stock = Number(body.stock);

    if (body.caracteristicas !== undefined) {
        const lista = Array.isArray(body.caracteristicas)
            ? body.caracteristicas
            : String(body.caracteristicas).split('\n');

        datos.caracteristicas = lista
            .map((item) => String(item).trim())
            .filter(Boolean);
    }

    return datos;
}

function manejarError(res, error, contexto) {
    if (error.name === 'ValidationError') {
        const errores = Object.values(error.errors).map((item) => item.message);

        return res.status(400).json({
            ok: false,
            mensaje: errores[0] || 'Datos inválidos',
            errores
        });
    }

    if (error.name === 'CastError') {
        return res.status(400).json({
            ok: false,
            mensaje: 'El ID enviado no es válido'
        });
    }

    console.error(contexto, error);
    return res.status(500).json({
        ok: false,
        mensaje: 'Error interno del servidor'
    });
}

// GET /api/admin/resumen -> métricas generales del panel.
router.get('/resumen', async (req, res) => {
    try {
        const [productos, stockBajo, usuarios, mensajesNuevos, productosStockBajo, ultimosMensajes] = await Promise.all([
            Producto.countDocuments(),
            Producto.countDocuments({ stock: { $lte: 3 } }),
            Usuario.countDocuments(),
            Contacto.countDocuments({
                $or: [{ estado: 'nuevo' }, { estado: { $exists: false } }]
            }),
            Producto.find({ stock: { $lte: 3 } })
                .select('nombre marca categoria precio stock')
                .sort({ stock: 1, nombre: 1 })
                .limit(5)
                .lean(),
            Contacto.find()
                .select('nombre apellido email titulo mensaje estado createdAt')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean()
        ]);

        return res.json({
            ok: true,
            resumen: {
                productos,
                stockBajo,
                usuarios,
                mensajesNuevos
            },
            productosStockBajo,
            ultimosMensajes: ultimosMensajes.map((contacto) => ({
                ...contacto,
                estado: contacto.estado || 'nuevo'
            }))
        });
    } catch (error) {
        return manejarError(res, error, 'Error obteniendo el resumen del panel:');
    }
});

// GET /api/admin/productos -> listado paginado para el panel.
router.get('/productos', async (req, res) => {
    try {
        const { page, limit, salto } = obtenerPaginacion(req);
        const filtro = {};
        const buscar = String(req.query.buscar || '').trim();
        const categoria = String(req.query.categoria || '').trim().toLowerCase();

        if (buscar) {
            const patron = new RegExp(escaparRegex(buscar), 'i');
            filtro.$or = [
                { nombre: patron },
                { marca: patron },
                { categoria: patron }
            ];
        }

        if (categoria) filtro.categoria = categoria;

        const [productos, total] = await Promise.all([
            Producto.find(filtro)
                .sort({ nombre: 1 })
                .skip(salto)
                .limit(limit)
                .lean(),
            Producto.countDocuments(filtro)
        ]);

        return res.json({
            ok: true,
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
            productos
        });
    } catch (error) {
        return manejarError(res, error, 'Error listando productos del panel:');
    }
});

// GET /api/admin/productos/:id -> detalle para editar.
router.get('/productos/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ID del producto no es válido'
            });
        }

        const producto = await Producto.findById(req.params.id).lean();

        if (!producto) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Producto no encontrado'
            });
        }

        return res.json({ ok: true, producto });
    } catch (error) {
        return manejarError(res, error, 'Error obteniendo producto del panel:');
    }
});

// POST /api/admin/productos -> crea un producto.
router.post('/productos', async (req, res) => {
    try {
        const producto = await Producto.create(datosProducto(req.body));

        return res.status(201).json({
            ok: true,
            mensaje: 'Producto creado correctamente',
            producto
        });
    } catch (error) {
        return manejarError(res, error, 'Error creando producto:');
    }
});

// PUT /api/admin/productos/:id -> actualiza un producto.
router.put('/productos/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ID del producto no es válido'
            });
        }

        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            datosProducto(req.body),
            { new: true, runValidators: true }
        ).lean();

        if (!producto) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Producto no encontrado'
            });
        }

        return res.json({
            ok: true,
            mensaje: 'Producto actualizado correctamente',
            producto
        });
    } catch (error) {
        return manejarError(res, error, 'Error actualizando producto:');
    }
});

// DELETE /api/admin/productos/:id -> elimina un producto.
router.delete('/productos/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ID del producto no es válido'
            });
        }

        const producto = await Producto.findByIdAndDelete(req.params.id).lean();

        if (!producto) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Producto no encontrado'
            });
        }

        return res.json({
            ok: true,
            mensaje: 'Producto eliminado correctamente'
        });
    } catch (error) {
        return manejarError(res, error, 'Error eliminando producto:');
    }
});

// GET /api/admin/contactos -> bandeja de mensajes.
router.get('/contactos', async (req, res) => {
    try {
        const { page, limit, salto } = obtenerPaginacion(req);
        const condiciones = [];
        const buscar = String(req.query.buscar || '').trim();
        const estado = String(req.query.estado || '').trim();

        if (buscar) {
            const patron = new RegExp(escaparRegex(buscar), 'i');
            condiciones.push({
                $or: [
                    { nombre: patron },
                    { apellido: patron },
                    { email: patron },
                    { titulo: patron },
                    { mensaje: patron }
                ]
            });
        }

        if (ESTADOS_CONTACTO.includes(estado)) {
            condiciones.push(
                estado === 'nuevo'
                    ? { $or: [{ estado: 'nuevo' }, { estado: { $exists: false } }] }
                    : { estado }
            );
        }

        const filtro = condiciones.length > 0 ? { $and: condiciones } : {};

        const [contactos, total] = await Promise.all([
            Contacto.find(filtro)
                .sort({ createdAt: -1 })
                .skip(salto)
                .limit(limit)
                .lean(),
            Contacto.countDocuments(filtro)
        ]);

        return res.json({
            ok: true,
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
            contactos: contactos.map((contacto) => ({
                ...contacto,
                estado: contacto.estado || 'nuevo'
            }))
        });
    } catch (error) {
        return manejarError(res, error, 'Error listando contactos del panel:');
    }
});

// PATCH /api/admin/contactos/:id -> cambia el estado del mensaje.
router.patch('/contactos/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ID del mensaje no es válido'
            });
        }

        const { estado } = req.body;

        if (!ESTADOS_CONTACTO.includes(estado)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El estado debe ser nuevo, leido o respondido'
            });
        }

        const contacto = await Contacto.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true, runValidators: true }
        ).lean();

        if (!contacto) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Mensaje no encontrado'
            });
        }

        return res.json({
            ok: true,
            mensaje: 'Estado del mensaje actualizado',
            contacto: {
                ...contacto,
                estado: contacto.estado || 'nuevo'
            }
        });
    } catch (error) {
        return manejarError(res, error, 'Error actualizando contacto:');
    }
});

// DELETE /api/admin/contactos/:id -> elimina un mensaje.
router.delete('/contactos/:id', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ID del mensaje no es válido'
            });
        }

        const contacto = await Contacto.findByIdAndDelete(req.params.id).lean();

        if (!contacto) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Mensaje no encontrado'
            });
        }

        return res.json({
            ok: true,
            mensaje: 'Mensaje eliminado correctamente'
        });
    } catch (error) {
        return manejarError(res, error, 'Error eliminando contacto:');
    }
});

// GET /api/admin/usuarios -> listado paginado de clientes y administradores.
router.get('/usuarios', async (req, res) => {
    try {
        const { page, limit, salto } = obtenerPaginacion(req);
        const filtro = {};
        const buscar = String(req.query.buscar || '').trim();
        const rol = String(req.query.rol || '').trim();
        const activo = String(req.query.activo || '').trim();

        if (buscar) {
            const patron = new RegExp(escaparRegex(buscar), 'i');
            filtro.$or = [{ nombre: patron }, { email: patron }];
        }

        if (ROLES.includes(rol)) filtro.rol = rol;

        if (activo === 'true') {
            filtro.$and = [
                { $or: [{ activo: true }, { activo: { $exists: false } }] }
            ];
        } else if (activo === 'false') {
            filtro.activo = false;
        }

        const [usuarios, total] = await Promise.all([
            Usuario.find(filtro)
                .select('nombre email rol activo createdAt ultimoAcceso')
                .sort({ createdAt: -1 })
                .skip(salto)
                .limit(limit)
                .lean(),
            Usuario.countDocuments(filtro)
        ]);

        return res.json({
            ok: true,
            total,
            page,
            pages: Math.max(1, Math.ceil(total / limit)),
            usuarios: usuarios.map(usuarioAdmin)
        });
    } catch (error) {
        return manejarError(res, error, 'Error listando usuarios del panel:');
    }
});

// PATCH /api/admin/usuarios/:id/rol -> cambia el rol de un usuario.
router.patch('/usuarios/:id/rol', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ID del usuario no es válido'
            });
        }

        const { rol } = req.body;

        if (!ROLES.includes(rol)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El rol debe ser usuario o admin'
            });
        }

        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        if (usuario._id.equals(req.usuario._id) && rol !== 'admin') {
            return res.status(400).json({
                ok: false,
                mensaje: 'No podés quitarte el rol de administrador'
            });
        }

        if ((usuario.rol || 'usuario') === 'admin' && rol !== 'admin') {
            const administradores = await Usuario.countDocuments({
                rol: 'admin',
                activo: { $ne: false }
            });

            if (administradores <= 1) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe existir al menos un administrador activo'
                });
            }
        }

        usuario.rol = rol;
        await usuario.save();

        return res.json({
            ok: true,
            mensaje: 'Rol actualizado correctamente',
            usuario: usuarioAdmin(usuario)
        });
    } catch (error) {
        return manejarError(res, error, 'Error actualizando rol de usuario:');
    }
});

// PATCH /api/admin/usuarios/:id/activo -> activa o desactiva una cuenta.
router.patch('/usuarios/:id/activo', async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El ID del usuario no es válido'
            });
        }

        const { activo } = req.body;

        if (typeof activo !== 'boolean') {
            return res.status(400).json({
                ok: false,
                mensaje: 'El estado de la cuenta debe ser verdadero o falso'
            });
        }

        const usuario = await Usuario.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        if (usuario._id.equals(req.usuario._id) && !activo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No podés desactivar tu propia cuenta'
            });
        }

        if (!activo && (usuario.rol || 'usuario') === 'admin') {
            const administradores = await Usuario.countDocuments({
                rol: 'admin',
                activo: { $ne: false }
            });

            if (administradores <= 1) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe existir al menos un administrador activo'
                });
            }
        }

        usuario.activo = activo;
        await usuario.save();

        return res.json({
            ok: true,
            mensaje: activo ? 'Cuenta activada correctamente' : 'Cuenta desactivada correctamente',
            usuario: usuarioAdmin(usuario)
        });
    } catch (error) {
        return manejarError(res, error, 'Error actualizando estado de usuario:');
    }
});

module.exports = router;
