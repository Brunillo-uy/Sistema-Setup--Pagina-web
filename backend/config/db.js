const mongoose = require('mongoose');

/**
 * Conecta la aplicación con MongoDB Atlas usando la URI del archivo .env
 */
const conectarDB = async () => {
    const uri = process.env.MONGO_URL;

    if (!uri) {
        throw new Error('La variable MONGO_URL no está definida en el archivo .env');
    }

    if (uri.includes('<db_password>')) {
        throw new Error(
            'Debes reemplazar <db_password> en MONGO_URL (.env) por la contraseña real del usuario de MongoDB Atlas'
        );
    }

    try {
        await mongoose.connect(uri, {
            dbName: process.env.MONGO_DB || 'sistema_setup'
        });

        console.log(`MongoDB conectado -> ${mongoose.connection.host}/${mongoose.connection.name}`);
    } catch (error) {
        console.error('Error al conectar con MongoDB Atlas:', error.message);
        throw error;
    }
};

module.exports = conectarDB;
