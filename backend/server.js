require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');

const conectarDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const rutaFrontend = path.join(__dirname, '..', 'frontend', 'dist');
const hayFrontendCompilado = fs.existsSync(path.join(rutaFrontend, 'index.html'));

if (hayFrontendCompilado) {
    app.use(express.static(rutaFrontend));

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
            mensaje: 'API funcionando. Compilá el frontend con "npm run build" para servir la página.',
        });
    });
}

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
