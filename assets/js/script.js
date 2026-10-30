const botonHamburguesa = document.querySelector('.boton-hamburguesa');
const menuMovil = document.getElementById('menu-movil');

const botonBuscadorMovil = document.querySelector('.boton-buscador-movil');
const contenedorBuscadorMovil = document.getElementById('contenedor-buscador-movil');

if (botonHamburguesa && menuMovil) {
    botonHamburguesa.addEventListener('click', () => {
        const estaActivo = menuMovil.classList.toggle('activo');
        botonHamburguesa.classList.toggle('activo', estaActivo);
        botonHamburguesa.setAttribute('aria-expanded', String(estaActivo));
    });
}

if (botonBuscadorMovil && contenedorBuscadorMovil) {
    botonBuscadorMovil.addEventListener('click', () => {
        const estaActivo = contenedorBuscadorMovil.classList.toggle('activo');
        botonBuscadorMovil.classList.toggle('activo', estaActivo);
        botonBuscadorMovil.setAttribute('aria-expanded', String(estaActivo));
    });
}

// Submenús del catálogo móvil
document.querySelectorAll('.boton-principal-menu-movil').forEach((boton) => {
    boton.addEventListener('click', () => {
        const submenu = boton.nextElementSibling;
        if (!submenu) return;

        const estaAbierto = submenu.classList.toggle('activo');
        boton.classList.toggle('activo', estaAbierto);
        boton.setAttribute('aria-expanded', String(estaAbierto));
    });
});

document.querySelectorAll('.boton-submenu-movil').forEach((boton) => {
    boton.addEventListener('click', () => {
        const submenu = boton.nextElementSibling;
        if (!submenu) return;

        const estaAbierto = submenu.classList.toggle('activo');
        boton.classList.toggle('activo', estaAbierto);
        boton.setAttribute('aria-expanded', String(estaAbierto));
    });
});