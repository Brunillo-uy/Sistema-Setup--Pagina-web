require('dotenv').config();

const mongoose = require('mongoose');
const conectarDB = require('../config/db');
const Usuario = require('../models/Usuario');

async function main() {
    const email = (process.argv[2] || '').trim().toLowerCase();

    if (!email) {
        console.error('Uso: npm run hacer-admin -- correo@ejemplo.com');
        process.exitCode = 1;
        return;
    }

    await conectarDB();

    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
        console.error(`No existe una cuenta con el email ${email}.`);
        console.error('Primero creala desde /registro y volvé a ejecutar este script.');
        process.exitCode = 1;
        return;
    }

    usuario.rol = 'admin';
    usuario.activo = true;
    await usuario.save();

    console.log(`Listo: ${usuario.email} ahora es administrador.`);
    console.log('Entrá a /admin con esa misma cuenta.');
}

main()
    .catch((error) => {
        console.error('No se pudo convertir el usuario en administrador:', error.message);
        process.exitCode = 1;
    })
    .finally(async () => {
        await mongoose.disconnect();
    });
