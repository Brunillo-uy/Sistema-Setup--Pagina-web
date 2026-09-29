const hamburger = document.getElementById('hamburger');
const navLista = document.getElementById('barra-navegacion-lista');

hamburger.addEventListener('click', () => {
    navLista.classList.toggle('active');
});