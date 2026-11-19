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
JWT_SECRET=una_clave_larga_y_aleatoria
JWT_EXPIRA=7d
```

Genera una clave segura para `JWT_SECRET` con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
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
| POST | `/api/contacto` | Guarda un mensaje del formulario |
| GET | `/api/productos` | Lista productos; acepta `categoria`, `marcas`, `chipset`, `precioMin`, `precioMax`, `buscar` y `orden` |
| GET | `/api/productos/filtros` | Categorías, marcas y rango de precios para el catálogo |
| GET | `/api/productos/:id` | Detalle de un producto puntual |
| POST | `/api/auth/registro` | Crea una cuenta con `nombre`, `email` y `password` |
| POST | `/api/auth/login` | Inicia sesión con `email` y `password` |
| GET | `/api/auth/perfil` | Devuelve el usuario dueño del token (`Authorization: Bearer ...`) |
| POST | `/api/auth/logout` | Cierra la sesión del lado del cliente |
| POST | `/api/chat` | Envía mensajes al chatbot local de Ollama con contexto del catálogo |
| GET | `/api/admin/resumen` | Métricas generales del panel (solo admin) |
| GET/POST/PUT/DELETE | `/api/admin/productos` | Gestión de productos (solo admin) |
| GET/PATCH/DELETE | `/api/admin/contactos` | Bandeja de mensajes (solo admin) |
| GET/PATCH | `/api/admin/usuarios` | Gestión de usuarios y roles (solo admin) |

### Autenticación

- Los usuarios se guardan en la colección `usuarios` de MongoDB.
- Las contraseñas se hashean con `bcryptjs`; nunca se guardan ni se devuelven en texto plano.
- El login devuelve un token JWT firmado con `JWT_SECRET`, válido por `JWT_EXPIRA` (7 días por defecto).
- El frontend guarda el token en `localStorage` y lo envía en la cabecera `Authorization` al pedir el perfil.
- El header muestra el nombre del usuario y enlaza a `/cuenta` cuando hay sesión activa.
- Si falta `JWT_SECRET`, el registro y el login responden con error. Reinicia el backend después de cambiar `.env`.

### Panel de administración

El panel interno está en `/admin` y solo se habilita para usuarios con rol `admin`. Las rutas `/api/admin/...` validan el rol en el backend; ocultar el enlace en la interfaz no es suficiente.

Para crear el primer administrador:

1. Creá una cuenta normal desde `/registro`.
2. Ejecutá desde `backend`:

```bash
npm run hacer-admin -- tu-correo@ejemplo.com
```

3. Volvé a iniciar sesión. El login redirige automáticamente al panel.

El panel permite:

- Ver métricas generales y productos con stock bajo.
- Crear, editar y eliminar productos.
- Revisar los mensajes de contacto y cambiar su estado.
- Ver usuarios, cambiar roles y activar o desactivar cuentas.
- Evitar que se elimine o desactive el último administrador activo.

El registro público siempre crea usuarios con rol `usuario`; nunca permite elegir `admin` desde el formulario.

### Cargar los productos de ejemplo

```bash
cd backend
npm run lista_productos
```

Esto crea o actualiza los productos de ejemplo sin cambiar el ID de los que ya existen. Los productos que ya no están en la lista se eliminan.

> Este comando solo carga la base de datos. Para ver la página, inicia el backend (`npm start` o `npm run dev` en `backend`) y el frontend (`npm run dev` en `frontend`), o compila el frontend y usa el servidor de producción.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`.

Rutas principales: `/`, `/catalogo`, `/producto/:id`, `/carrito`, `/monitores`, `/contacto`, `/login`, `/registro`, `/cuenta` y `/admin` (solo administradores).

Para apuntar a otra API, crea `frontend/.env`:

```
VITE_API_URL=http://localhost:3000/api
```

En producción, `.env.production` ya usa `/api` (mismo servidor).

### Catálogo en móvil

- En pantallas pequeñas, el aside de filtros se muestra reducido para no ocupar toda la pantalla.
- El botón **Mostrar filtros** despliega categorías, marcas y precio; **Ocultar filtros** vuelve a la vista compacta.
- En escritorio los filtros siguen visibles todo el tiempo.

### Buscador

- La barra de búsqueda del header funciona en escritorio y en el menú móvil.
- Al enviar un término, redirige a `/catalogo?buscar=...` y muestra los productos cuyo nombre, marca o descripción coincidan.
- La búsqueda no distingue mayúsculas de minúsculas y también acepta coincidencias parciales del nombre.

### Chatbot con Ollama

El chatbot usa un modelo local mediante [Ollama](https://ollama.com/). No necesita claves de API ni envía las conversaciones a un servicio externo.

1. Instalá Ollama.
2. Descargá un modelo:

```bash
ollama pull llama3.2:3b
```

3. Verificá que Ollama esté ejecutándose en `http://127.0.0.1:11434`.
4. Reiniciá el backend después de cambiar las variables de entorno.

Variables opcionales en `backend/.env`:

```env
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
OLLAMA_TIMEOUT_MS=90000
```

El endpoint `POST /api/chat` recibe un historial de mensajes. Las consultas de productos y las preguntas frecuentes se responden con datos exactos de MongoDB y respuestas controladas; las consultas abiertas se envían al modelo local con contexto del catálogo. Si Ollama no está disponible, el chatbot muestra un mensaje de error y no bloquea el resto de la página.

### Carrito de compras

- Cualquier visitante puede agregar productos al carrito sin iniciar sesión.
- El icono del carrito del header muestra un contador rojo con el total de unidades agregadas.
- La página `/carrito` permite cambiar cantidades, quitar productos, vaciar el carrito y ver el total.
- Para finalizar la compra hay que iniciar sesión o crear una cuenta. El carrito se conserva y, al volver, la persona regresa directamente a `/carrito`.
- El carrito se guarda en `localStorage`, por lo que se mantiene al recargar o cerrar el navegador.
- El botón **Finalizar compra** es simulado: muestra el total y no procesa ningún pago real.

### Imágenes de productos

Coloca las fotos en `frontend/public/img/productos/` con los nombres que indica `LEEME.txt`. Mientras falten, se muestra `placeholder.svg`.

Si usas el servidor de producción en el puerto `3000`, ejecuta `npm run build --prefix frontend` después de agregar o cambiar imágenes. En desarrollo (`npm run dev`), Vite las toma directamente desde `public`.

Los productos y sus rutas de imagen se cargan con `npm run lista_productos` desde `backend/lista_productos/productos.js`. Para usar otro formato (`.jpg`, `.png`), actualiza el campo `imagen` de cada producto en ese archivo.

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
- Autenticación con JWT + bcryptjs
- CSS propio (sin frameworks)

## Versión anterior

Los archivos HTML/CSS/JS de la versión vanilla fueron eliminados. El historial completo queda en Git y el resumen de la migración está en [CAMBIOS.md](CAMBIOS.md).

## Autor

Bruno Silva
