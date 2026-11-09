import CategoriaCard from './CategoriaCard.jsx'
import { categorias } from '../data/categorias.js'

function Catalogo() {
  return (
    <main className="catalogo-seccion">
      <div className="catalogo-grid-div">
        {categorias.map((catalogo) => (
          <CategoriaCard
            key={catalogo.Id}
            Imagen={catalogo.Imagen}
            Titulo={catalogo.Titulo}
            IdImagen={catalogo.IdImagen}
            Alt={catalogo.Alt}
          />
        ))}
      </div>
    </main>
  )
}

export default Catalogo
