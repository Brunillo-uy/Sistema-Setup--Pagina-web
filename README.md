# Sistema Setup

Página web de venta de equipos y accesorios de computación. Migrada de HTML/CSS/JS vanilla a **React** con **Vite**, manteniendo el backend de **Node.js + Express + MongoDB Atlas**.

## Estructura

```
backend/    API REST (Express + Mongoose)
frontend/   Interfaz React (Vite)
DESPLIEGUE.md   Guía para publicar la página
```

## Requisitos

- Node.js 20 o superior
- Una base de datos en MongoDB Atlas

## Backend

```bash
cd backend
npm install
```

Copia `backend/.env.example` a `backend/.env` y completa:

```
MONGO_URL=tu_cadena_de_conexion
MONGO_DB=sistema_setup
PORT=3000
```

Arranca:

```bash
npm run dev    # con recarga automática
npm start      # modo normal
```

### Endpoints

| Método | Ruta | Descripción |
| :----- | :--- | :---------- |
| GET | `/api/salud` | Comprueba que el servidor responde |
| GET | `/api/contacto` | Lista los últimos mensajes |
| POST | `/api/contacto` | Guarda un mensaje del formulario |

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`.

Para apuntar a otra API, crea `frontend/.env`:

```
VITE_API_URL=http://localhost:3000/api
```

En producción, `.env.production` ya usa `/api` (mismo servidor).

## Producción

Un solo servidor sirve la página compilada y la API:

```bash
cd frontend
npm run build
cd ../backend
npm start
```

Abre `http://localhost:3000`. Instrucciones completas en [DESPLIEGUE.md](DESPLIEGUE.md).

## Tecnologías

- React 19 + Vite
- Node.js + Express 5
- MongoDB Atlas + Mongoose
- CSS propio (sin frameworks)

## Versión anterior

Los archivos HTML/CSS/JS de la versión vanilla fueron eliminados. El historial completo queda en Git y el resumen de la migración está en [CAMBIOS.md](CAMBIOS.md).

## Autor

Bruno Silva
