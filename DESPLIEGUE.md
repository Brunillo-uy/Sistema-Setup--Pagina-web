# Despliegue

## Cómo queda armado

En producción **un solo servidor** hace todo:

- Express sirve la página de React compilada (`frontend/dist`).
- La API sigue en `http://TU-SERVIDOR/api/...`.
- El frontend llama a `/api` (ruta relativa), así que no hay problemas de CORS.

En desarrollo se mantiene separado: Vite en `http://localhost:5173` y la API en `http://localhost:3000`.

## Probar producción en local

```bash
# 1. Compilar el frontend
cd frontend
npm run build

# 2. Arrancar el servidor
cd ../backend
npm start
```

Abre `http://localhost:3000`.

Debes ver la página, navegar entre Inicio / Catálogo / Monitores / Contacto y que
`http://localhost:3000/api/salud` responda JSON.

> Requiere `backend/.env` con `MONGO_URL` y `MONGO_DB`.

## Variables de entorno

**Backend** (`backend/.env` o panel del hosting):

| Variable       | Obligatoria | Para qué |
| :------------- | :---------- | :------- |
| `MONGO_URL`    | Sí          | Cadena de conexión de MongoDB Atlas |
| `MONGO_DB`     | Sí          | Nombre de la base de datos |
| `PORT`         | No          | La asigna el hosting automáticamente |
| `FRONTEND_URL` | No          | Solo si el frontend se despliega aparte |

**Frontend:** `.env.production` ya define `VITE_API_URL=/api`.

## Ejemplo con Render

1. Sube el proyecto a GitHub.
2. En Render: **New → Web Service** y elige el repositorio.
3. Configura:
   - **Root Directory:** la raíz del repositorio (vacío o `.`)
   - **Build Command:**
     ```bash
     npm install --prefix backend && npm install --include=dev --prefix frontend && npm run build --prefix frontend
     ```
   - **Start Command:**
     ```bash
     node backend/server.js
     ```
4. Agrega las variables `MONGO_URL` y `MONGO_DB`.
5. En MongoDB Atlas → **Network Access**, permite `0.0.0.0/0` para que Render pueda conectarse.

Cada vez que hagas push, Render vuelve a compilar y desplegar.

## Errores típicos

- **Pantalla en blanco:** faltó `npm run build` o el hosting no encontró `frontend/dist`.
- **`Faltan campos obligatorios`:** revisa que el POST envíe las 7 claves del formulario.
- **Error de conexión a Mongo:** la IP del hosting no está permitida en Atlas.
- **CORS:** solo ocurre si separas frontend y backend; agrega la URL del frontend en `FRONTEND_URL`.
