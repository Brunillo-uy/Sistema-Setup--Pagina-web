import { Link } from 'react-router'

function PaginaNoEncontrada() {
  return (
    <main className="pagina-no-encontrada">
      <h1>Página no encontrada</h1>
      <p>La dirección que escribiste no existe o fue movida.</p>
      <Link className="boton-volver" to="/">
        Volver al inicio
      </Link>
    </main>
  )
}

export default PaginaNoEncontrada
