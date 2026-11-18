import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { obtenerProducto } from '../api.js'
import ListaCaracteristicas from './ListaCaracteristicas.jsx'
import { useCarrito } from '../context/useCarrito.js'
import { etiquetaCategoria } from '../utils/categorias.js'
import { etiquetaMarca } from '../utils/marcas.js'

const formatearPrecio = (valor, moneda = 'US$') => `${valor} ${moneda}`

function PaginaProducto({ id }) {
  const { agregarProducto } = useCarrito()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [cantidad, setCantidad] = useState(1)
  const [mensajeCarrito, setMensajeCarrito] = useState(null)

  useEffect(() => {
    let activo = true

    obtenerProducto(id)
      .then((datos) => {
        if (activo) setProducto(datos)
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [id])

  const stock = producto?.stock ?? 0
  const sinStock = stock <= 0

  const cambiarCantidad = (valor) => {
    if (sinStock) return

    const numero = Number(valor)

    if (Number.isNaN(numero)) return

    setCantidad(Math.min(Math.max(Math.trunc(numero), 1), stock))
    setMensajeCarrito(null)
  }

  const alAgregarAlCarrito = () => {
    if (!producto || sinStock) return

    const resultado = agregarProducto(producto, cantidad)

    if (resultado.agregadas === 0) {
      setMensajeCarrito({
        tipo: 'error',
        texto: 'Ya tenés el máximo disponible de este producto en el carrito.',
      })
      return
    }

    setMensajeCarrito({
      tipo: 'ok',
      agregadas: resultado.agregadas,
      enCarrito: resultado.enCarrito,
    })
  }

  if (cargando) {
    return (
      <main className="producto-pagina">
        <p className="producto-estado">Cargando producto...</p>
      </main>
    )
  }

  if (error || !producto) {
    return (
      <main className="producto-pagina">
        <div className="producto-estado producto-estado-error">
          <h1>Producto no disponible</h1>
          <p>{error || 'No encontramos el producto que buscás.'}</p>
          <Link className="boton-volver" to="/catalogo">
            Volver al catálogo
          </Link>
        </div>
      </main>
    )
  }

  const alFallarImagen = (evento) => {
    evento.currentTarget.onerror = null
    evento.currentTarget.src = '/img/productos/placeholder.svg'
  }

  return (
    <main className="producto-pagina">
      <nav className="miga-pan" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link>
        <span>/</span>
        <Link to="/catalogo">Catálogo</Link>
        <span>/</span>
        <span aria-current="page">{producto.nombre}</span>
      </nav>

      <article className="producto-detalle">
        <div className="producto-detalle-imagen">
          <img
            src={producto.imagen || '/img/productos/placeholder.svg'}
            alt={producto.nombre}
            onError={alFallarImagen}
          />
        </div>

        <div className="producto-detalle-info">
          <p className="producto-detalle-marca">
            {etiquetaMarca(producto.marca)} · {etiquetaCategoria(producto.categoria)}
          </p>
          <h1>{producto.nombre}</h1>
          <p className="producto-detalle-precio">
            {formatearPrecio(producto.precio, producto.moneda)}
          </p>

          {producto.descripcion && (
            <p className="producto-detalle-descripcion">{producto.descripcion}</p>
          )}

          <ListaCaracteristicas caracteristicas={producto.caracteristicas} />

          <div className="producto-compra">
            <div className="selector-cantidad">
              <span>Cantidad</span>

              <div className="controles-cantidad">
                <button
                  type="button"
                  onClick={() => cambiarCantidad(cantidad - 1)}
                  disabled={sinStock || cantidad <= 1}
                  aria-label="Quitar una unidad"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={stock}
                  value={cantidad}
                  onChange={(evento) => cambiarCantidad(evento.target.value)}
                  disabled={sinStock}
                  aria-label="Cantidad de unidades"
                />
                <button
                  type="button"
                  onClick={() => cambiarCantidad(cantidad + 1)}
                  disabled={sinStock || cantidad >= stock}
                  aria-label="Agregar una unidad"
                >
                  +
                </button>
              </div>

              <span className="stock-info">
                {sinStock ? 'Sin stock' : `${stock} unidades disponibles`}
              </span>
            </div>

            <div className="resumen-compra">
              <span>Total a pagar</span>
              <strong>{formatearPrecio(producto.precio * cantidad, producto.moneda)}</strong>
            </div>

            <button
              type="button"
              className="boton-comprar"
              onClick={alAgregarAlCarrito}
              disabled={sinStock}
            >
              {sinStock ? 'Sin stock' : 'Añadir al carrito'}
            </button>

            {mensajeCarrito && (
              <p
                className={`compra-simulada mensaje-carrito ${
                  mensajeCarrito.tipo === 'error' ? 'mensaje-carrito-error' : ''
                }`}
                role="status"
              >
                {mensajeCarrito.tipo === 'error' ? (
                  mensajeCarrito.texto
                ) : (
                  <>
                    ✅ Agregaste {mensajeCarrito.agregadas}{' '}
                    {mensajeCarrito.agregadas === 1 ? 'unidad' : 'unidades'}. Llevás{' '}
                    {mensajeCarrito.enCarrito}{' '}
                    {mensajeCarrito.enCarrito === 1 ? 'unidad' : 'unidades'} de este
                    producto en el carrito. <Link to="/carrito">Ver carrito</Link>
                  </>
                )}
              </p>
            )}
          </div>

          <Link className="boton-volver" to="/catalogo">
            ← Volver al catálogo
          </Link>
        </div>
      </article>
    </main>
  )
}

export default PaginaProducto
