const express = require('express');
const cors = require('cors');

const contactoRoutes = require('./routes/contacto');
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const chatRoutes = require('./routes/chat');

const app = express();

app.set('trust proxy', 1);

const origenesPermitidos = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsPermitido = cors({
    origin: (origin, callback) => {
        if (!origin || origenesPermitidos.includes(origin)) {
            return callback(null, true);
        }

        return callback(null, false);
    },
});

app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin) {
        try {
            if (new URL(origin).host === req.headers.host) {
                return next();
            }
        } catch {
        }
    }

    return corsPermitido(req, res, next);
});

app.use('/api/contacto', contactoRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/salud', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Servidor funcionando correctamente',
    });
});

app.use('/api', (req, res) => {
    res.status(404).json({
        ok: false,
        mensaje: 'Ruta no encontrada',
    });
});

module.exports = app;