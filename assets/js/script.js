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

// Formulario de contacto -> guarda el mensaje en MongoDB Atlas
const formularioContacto = document.querySelector('.contactoForm');

if (formularioContacto) {
    const botonEnviar = document.getElementById('enviar-formulario-btn');

    const mostrarEstado = (texto, esError = false) => {
        let estado = document.getElementById('estado-formulario');

        if (!estado) {
            estado = document.createElement('p');
            estado.id = 'estado-formulario';
            formularioContacto.appendChild(estado);
        }

        estado.textContent = texto;
        estado.style.marginTop = '1rem';
        estado.style.fontWeight = '600';
        estado.style.color = esError ? '#dc2626' : '#16a34a';
    };

    formularioContacto.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const datos = {
            nombre: document.getElementById('nombre-input').value.trim(),
            apellido: document.getElementById('apellido-input').value.trim(),
            email: document.getElementById('email-input').value.trim(),
            fechaNacimiento: document.getElementById('bday-input').value,
            genero: document.getElementById('Genero-seleccion').value,
            titulo: document.getElementById('titulo-input').value.trim(),
            mensaje: document.getElementById('mensaje-input').value.trim()
        };

        if (botonEnviar) {
            botonEnviar.disabled = true;
            botonEnviar.value = 'Enviando...';
        }
        mostrarEstado('Enviando mensaje...');

        try {
            const respuesta = await fetch('/api/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datos)
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                const detalle = resultado.errores ? ` (${resultado.errores.join(', ')})` : '';
                throw new Error(`${resultado.mensaje || 'No se pudo enviar el mensaje'}${detalle}`);
            }

            mostrarEstado(resultado.mensaje || '¡Mensaje enviado correctamente!');
            formularioContacto.reset();
        } catch (error) {
            mostrarEstado(error.message || 'Error de conexión con el servidor', true);
        } finally {
            if (botonEnviar) {
                botonEnviar.disabled = false;
                botonEnviar.value = 'Enviar';
            }
        }
    });
}