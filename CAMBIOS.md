# Cambios de la migración

Resumen de cómo era el proyecto antes (HTML/CSS/JS vanilla) y cómo es ahora (React).

## Antes y ahora

| Antes (vanilla) | Ahora (React) |
| :-------------- | :------------ |
| Cuatro páginas HTML: `index.html`, `catalogo.html`, `catalogo-monitores.html`, `contacto.html` | Una sola página (SPA) con estado `paginaActiva` en `App` |
| Navegación con enlaces entre archivos `.html` | El `Header` avisa con `alNavegar` y `App` decide qué página renderizar |
| Manipulación del DOM con `querySelector` y `addEventListener` | `useState` + `onClick` / `onChange` |
| Menú hamburguesa, buscador y submenús controlados con clases y JS | Estados `menuAbierto`, `buscadorAbierto` y `submenus` |
| Tarjetas del catálogo repetidas en el HTML | `data/categorias.js` + `.map()` con `key` |
| Formulario con `value` leído desde el DOM | Formulario controlado con un objeto de estado |
| `fetch` escrito dentro del script | `src/api.js` con `obtenerContactos()` y `enviarContacto()` |
| `document.querySelector` para mostrar mensajes | `useEffect` con estados `cargando` / `error` y resultado del envío |
| Estilos e imágenes enlazados a `assets/` | CSS en `src/index.css` e imágenes en `public/img/` |
| Express servía archivos estáticos de la página vieja | Express sirve `frontend/dist` y mantiene la API en `/api` |
| Configuración repartida entre archivos | `.env` para secretos y `.env.production` para el build |

## Lo que aprendí
<!-- TODO: escribe esta sección con tus palabras. Entre 3 y 5 ideas. -->
- TODO: ¿Qué es un componente y por qué me ayuda a reutilizar código?
Componentes son funciones que devuelven JSX. Me permiten reutilizar código y encapsular logica en un solo lugar.
- TODO: ¿Para qué sirve `useState` y cómo lo usé en el menú y el formulario?
useState me permite guardar y actualizar el estado de un componente. Lo useé en el menú y el formulario para controlar su estado y re-renderizarlos.
- TODO: ¿Qué hace `useEffect` y dónde lo usé?
useEffect me permite ejecutar código después de que el componente se renderice. Lo useé en el formulario para enviar los datos al servidor y mostrar mensajes de éxito o error.
- TODO: ¿Qué diferencia hay entre props y estado?
Props son datos que se pasan a un componente desde el padre. El estado es datos que se guardan en el componente y pueden ser actualizados con `useState`.
- TODO: ¿Qué fue lo más difícil de la migración y cómo lo resolví?
El más difícil fue la migración de la API a React. Lo resolví utilizando `axios` para hacer las llamadas a la API y `useState` para manejar el estado de la respuesta.
