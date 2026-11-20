import { useLocation } from 'react-router'
import Catalogo from './Catalogo.jsx'

function PaginaCatalogo() {
  const { search } = useLocation()

  return <Catalogo key={search} />
}

export default PaginaCatalogo
