require('dotenv').config();

const express = require('express');
const conectarDB = require('./config/db');
const contactoRoutes = require('./routes/contacto');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para leer JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000' }));

// Rutas de la API
app.use('/api/contacto', contactoRoutes);

app.get('/api/salud', (req, res) => {
    res.json({ ok: true, mensaje: 'Servidor funcionando correctamente' });
});

// 404 para rutas de API
app.use('/api', (req, res) => {
    res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada' });
});

// Arrancar el servidor solo si la base de datos se conecta
const iniciar = async () => {
    try {
        await conectarDB();
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('No se pudo iniciar el servidor:', error.message);
        process.exit(1);
    }
};

iniciar();
