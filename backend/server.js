require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');
const conectarDB = require('./config/db');
const contactoRoutes = require('./routes/contacto');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Orígenes autorizados para usar la API desde el navegador.
const origenesPermitidos = [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.FRONTEND_URL,
].filter(Boolean);

// Middlewares para leer JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsPermitido = cors({
    origin: (origin, callback) => {
        if (!origin || origenesPermitidos.includes(origin)) {
            return callback(null, true);
        }
        // No lanzamos error: simplemente no se agregan las cabeceras CORS.
        return callback(null, false);
    },
});

app.use((req, res, next) => {
    const origin = req.headers.origin;

    // Petición a la misma página (producción): no necesita CORS.
    if (origin) {
        try {
            if (new URL(origin).host === req.headers.host) {
                return next();
            }
        } catch {
            // Origin inválido: sigue al middleware de CORS.
        }
    }

    return corsPermitido(req, res, next);
});

// Rutas de la API
app.use('/api/contacto', contactoRoutes);

app.get('/api/salud', (req, res) => {
    res.json({ ok: true, mensaje: 'Servidor funcionando correctamente' });
});

// 404 para rutas de API
app.use('/api', (req, res) => {
    res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

// Sirve la página de React ya compilada (frontend/dist) si existe.
const rutaFrontend = path.join(__dirname, '..', 'frontend', 'dist');
const hayFrontendCompilado = fs.existsSync(path.join(rutaFrontend, 'index.html'));

if (hayFrontendCompilado) {
    app.use(express.static(rutaFrontend));

    // Cualquier ruta que no sea de la API devuelve la SPA.
    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api')) {
            return next();
        }
        res.sendFile(path.join(rutaFrontend, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.json({
            ok: true,
            mensaje: 'API funcionando. Compila el frontend con "npm run build" para servir la página.',
        });
    });
}

// Arrancar el servidor solo si la base de datos se conecta
const iniciar = async () => {
    try {
        await conectarDB();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
            console.log(
                hayFrontendCompilado
                    ? 'Sirviendo la página de React desde frontend/dist'
                    : 'Frontend no compilado: solo API disponible'
            );
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
};

iniciar();
