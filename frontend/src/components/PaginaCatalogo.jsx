import { useLocation } from 'react-router'
import Catalogo from './Catalogo.jsx'

function PaginaCatalogo() {
  const { search } = useLocation()

  // Al cambiar los filtros desde un enlace del header, se reinicia el catálogo
  // con la categoría, las marcas y el chipset indicados en la URL.
  return <Catalogo key={search} />
}

export default PaginaCatalogo
