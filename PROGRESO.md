# Progreso de la migración a React

> Marca `[x]` solo cuando la tarea esté **lista y revisada**.
> 🤖 = lo hace OpenCode · 🧑‍💻 = lo hago yo (con guía, sin solución escrita)

## Decisiones tomadas (Fase 0)

- [x] Navegación: SPA con la página activa en el estado de `App` (sin React Router).
- [x] `Sistema_Setup/`: se reutiliza como `frontend/` (no se crea otro proyecto).
- [x] MongoDB: se deja Atlas como está; no se toca la conexión ni los datos.
- [x] `mi_cuenta.html` y `carrito.html`: se quitan sus enlaces.

## Fase 1 — Carpeta backend

- [x] 🤖 Crear rama `migracion-react`, mover servidor a `backend/` con `git mv`, ajustar scripts, quitar `express.static` y rutas HTML, crear `backend/.env.example`.
- [x] 🧑‍💻 Configurar CORS para `http://localhost:5173` e instalar `cors`.
- [x] 🧑‍💻 Probar la API con `npm run dev` (GET `/api/salud`, GET `/api/contacto`, POST `/api/contacto`).
- [x] 🧑‍💻 Commit: `refactor: mover API a carpeta backend`.

## Fase 2 — Proyecto React con Vite

- [x] 🧑‍💻 Convertir `Sistema_Setup/` en `frontend/` y comprobar que arranca con `npm install` y `npm run dev`.
- [x] 🤖 Limpiar plantilla, copiar CSS, imágenes y fuentes, adaptar `index.html`, crear `.env` / `.env.example`, dejar `App.jsx` con un `<h1>`.
- [x] 🧑‍💻 Comprobar en `localhost:5173` que se ve el `<h1>` con mis estilos.
- [x] 🧑‍💻 Commit: `chore: crear frontend con Vite + React`.

## Fase 3 — Componentes (HTML → JSX)

- [x] 🤖 Ejemplo guiado: convertir `Footer` (HTML original vs JSX lado a lado).
- [x] 🧑‍💻 Mis primeros componentes (Sesión 16): `Header.jsx` y `Hero.jsx`, e importarlos en `App.jsx`.
- [x] 🤖 Convertir la sección larga de texto fijo ("Garantías" del inicio).
- [x] 🤖 Crear `frontend/src/data/categorias.js` con las 6 categorías del catálogo.
- [x] 🧑‍💻 Componente reutilizable `CategoriaCard.jsx` con props + lista con `.map()` y `key`.
- [x] 🧑‍💻 Convertir el formulario de contacto a JSX (sin lógica todavía).
- [x] 🧑‍💻 Commit: `feat: componentes de la página en React`.

## Fase 4 — Interactividad con useState

- [x] 🧑‍💻 Primer estado: menú hamburguesa (abrir/cerrar).
- [x] 🧑‍💻 Segundo estado: buscador móvil (mismo patrón).
- [x] 🧑‍💻 Tercer estado: submenús desplegables del menú móvil (varios a la vez).
- [x] 🧑‍💻 Subir el estado a `App` y pasarlo por props: navegación SPA entre Inicio, Catálogo, Monitores y Contacto.
- [x] 🧑‍💻 Formulario controlado: `value` + `onChange` y validación.
- [x] 🤖 Resto de interactividad: no aplica (el desplegable del catálogo de escritorio funciona solo con CSS).
- [ ] 🧑‍💻 Commit: `feat: interactividad con useState`.

## Fase 5 — Conectar con la API

- [ ] 🤖 Crear `frontend/src/api.js` con `VITE_API_URL` y una función de ejemplo comentada.
- [ ] 🧑‍💻 Traer datos con `useEffect` + estados `cargando` / `error` (adaptado a mis endpoints reales).
- [ ] 🧑‍💻 Enviar el formulario con POST desde `api.js`.
- [ ] 🤖 Funciones restantes de la API siguiendo mi patrón.
- [ ] 🧑‍💻 Probar todo con el backend y MongoDB encendidos.
- [ ] 🧑‍💻 Commit: `feat: frontend conectado a la API`.

## Fase 6 — Cierre

- [ ] 🤖 `.gitignore` en la raíz, `README.md` y lista de archivos vanilla sin usar.
- [ ] 🤖 `CAMBIOS.md` con la tabla "antes (vanilla) → ahora (React)".
- [ ] 🧑‍💻 Escribir en `CAMBIOS.md` la sección "Lo que aprendí".
- [ ] 🧑‍💻 Commit: `docs: README y resumen de la migración`.
