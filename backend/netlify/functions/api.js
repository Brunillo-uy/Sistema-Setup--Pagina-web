const serverless = require('serverless-http');

const app = require('../../app');
const conectarDB = require('../../config/db');

let conexion = null;
const handler = serverless(app);

exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    if (!conexion) {
        conexion = conectarDB().catch((error) => {
            conexion = null;
            throw error;
        });
    }

    await conexion;

    const prefijo = '/.netlify/functions/api';

    if (event.path?.startsWith(prefijo)) {
        event.path = event.path.replace(prefijo, '/api');
    }

    if (event.rawPath?.startsWith(prefijo)) {
        event.rawPath = event.rawPath.replace(prefijo, '/api');
    }

    return handler(event, context);
};