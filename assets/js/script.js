const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('barra-navegacion-lista');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});