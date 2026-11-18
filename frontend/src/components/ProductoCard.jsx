import { Link } from 'react-router'

function ProductoCard({ producto }) {
  const alFallarImagen = (evento) => {
    evento.currentTarget.onerror = null
    evento.currentTarget.src = '/img/productos/placeholder.svg'
  }

  return (
    <Link
      to={`/producto/${producto._id}`}
      className="producto-card"
      aria-label={`Ver detalle de ${producto.nombre}`}
    >
      <div className="producto-imagen">
        <img
          src={producto.imagen || '/img/productos/placeholder.svg'}
          alt={producto.nombre}
          loading="lazy"
          onError={alFallarImagen}
        />
      </div>
      <h3 className="producto-titulo">{producto.nombre}</h3>
      <p className="producto-precio">
        {producto.precio} {producto.moneda || 'US$'}
      </p>
    </Link>
  )
}

export default ProductoCard
