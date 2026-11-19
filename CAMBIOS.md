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

- Los componentes son funciones que devuelven JSX. Me permiten reutilizar código y encapsular la lógica en un solo lugar.
- `useState` me permite guardar y actualizar el estado de un componente. Lo usé en el menú y en el formulario para controlar sus valores y volver a renderizar.
- `useEffect` me permite ejecutar código después de que el componente se renderiza. Lo usé en la página de Contacto para pedir la lista de mensajes al abrirla.
- Las props son datos que se pasan a un componente desde el padre. El estado son datos que guarda el componente y que pueden cambiar con `useState`.
- Lo más difícil fue conectar el frontend con la API. Lo resolví creando `src/api.js` con `fetch` y manejando los estados de carga y error.
