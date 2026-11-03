require('dotenv').config();

const express = require('express');
const path = require('path');
const conectarDB = require('./config/db');
const contactoRoutes = require('./routes/contacto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares para leer JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (imágenes, CSS, JS)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Rutas de la API
app.use('/api/contacto', contactoRoutes);

app.get('/api/salud', (req, res) => {
    res.json({ ok: true, mensaje: 'Servidor funcionando correctamente' });
});

// Páginas HTML
const paginas = ['index.html', 'catalogo.html', 'catalogo-monitores.html', 'contacto.html'];

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
paginas.forEach((pagina) => {
    app.get(`/${pagina}`, (req, res) => res.sendFile(path.join(__dirname, pagina)));
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
