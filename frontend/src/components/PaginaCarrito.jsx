import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth.js'
import { useCarrito } from '../context/useCarrito.js'

const formatearPrecio = (valor, moneda = 'US$') => `${valor} ${moneda}`

function PaginaCarrito() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const {
    items,
    totalUnidades,
    totalPrecio,
    moneda,
    actualizarCantidad,
    quitarProducto,
    vaciarCarrito,
  } = useCarrito()
  const [mensaje, setMensaje] = useState('')

  const alFallarImagen = (evento) => {
    evento.currentTarget.onerror = null
    evento.currentTarget.src = '/img/productos/placeholder.svg'
  }

  const finalizarCompra = () => {
    if (items.length === 0) return

    if (!usuario) {
      navigate('/login', { state: { desde: '/carrito' } })
      return
    }

    setMensaje(
      `Compra simulada por ${formatearPrecio(totalPrecio, moneda)}. No se procesó ningún pago real.`,
    )
  }

  if (items.length === 0) {
    return (
      <main className="carrito-pagina">
        <section className="carrito-vacio">
          <p className="carrito-vacio-icono" aria-hidden="true">🛒</p>
          <h1>Tu carrito está vacío</h1>
          <p>Todavía no agregaste productos. ¡Tu próximo setup te está esperando!</p>
          <Link to="/catalogo" className="carrito-boton-catalogo">
            Ver catálogo
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="carrito-pagina">
      <div className="carrito-encabezado">
        <div>
          <h1>Mi carrito</h1>
          <p>
            {totalUnidades} {totalUnidades === 1 ? 'unidad' : 'unidades'} en tu compra
          </p>
        </div>
        <button type="button" className="carrito-vaciar" onClick={vaciarCarrito}>
          Vaciar carrito
        </button>
      </div>

      <div className="carrito-layout">
        <section className="carrito-lista" aria-label="Productos en el carrito">
          {items.map((item) => (
            <article className="carrito-item" key={item.id}>
              <div className="carrito-item-imagen">
                <img src={item.imagen} alt={item.nombre} onError={alFallarImagen} />
              </div>

              <div className="carrito-item-info">
                <h2>{item.nombre}</h2>
                <p>Precio unitario: {formatearPrecio(item.precio, item.moneda)}</p>
                <p className="carrito-item-stock">
                  {item.stock > 0 ? `${item.stock} disponibles` : 'Sin stock'}
                </p>
              </div>

              <div className="carrito-item-acciones">
                <div className="carrito-cantidad">
                  <span>Cantidad</span>
                  <div className="controles-cantidad">
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      disabled={item.cantidad <= 1}
                      aria-label={`Quitar una unidad de ${item.nombre}`}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={item.stock}
                      value={item.cantidad}
                      onChange={(evento) =>
                        actualizarCantidad(item.id, evento.target.value)
                      }
                      aria-label={`Cantidad de ${item.nombre}`}
                    />
                    <button
                      type="button"
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      disabled={item.stock <= 0 || item.cantidad >= item.stock}
                      aria-label={`Agregar una unidad de ${item.nombre}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <strong className="carrito-item-subtotal">
                  {formatearPrecio(item.precio * item.cantidad, item.moneda)}
                </strong>

                <button
                  type="button"
                  className="carrito-quitar"
                  onClick={() => quitarProducto(item.id)}
                >
                  Quitar
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="carrito-resumen" aria-label="Resumen de compra">
          <h2>Resumen</h2>

          <div className="carrito-resumen-linea">
            <span>Productos</span>
            <span>{totalUnidades}</span>
          </div>
          <div className="carrito-resumen-linea">
            <span>Subtotal</span>
            <span>{formatearPrecio(totalPrecio, moneda)}</span>
          </div>
          <div className="carrito-resumen-linea">
            <span>Envío</span>
            <span>A coordinar</span>
          </div>

          <div className="carrito-resumen-total">
            <span>Total</span>
            <strong>{formatearPrecio(totalPrecio, moneda)}</strong>
          </div>

          {usuario ? (
            <>
              <p className="carrito-sesion-activa">
                Comprando como <strong>{usuario.nombre}</strong>
              </p>
              <button type="button" className="boton-comprar" onClick={finalizarCompra}>
                Finalizar compra (simulada)
              </button>
            </>
          ) : (
            <div className="carrito-requiere-sesion">
              <p>
                Para finalizar la compra necesitás iniciar sesión o crear una cuenta.
                Tu carrito se conserva.
              </p>
              <Link
                to="/login"
                state={{ desde: '/carrito' }}
                className="carrito-boton-login"
              >
                Iniciar sesión para comprar
              </Link>
              <Link to="/registro" state={{ desde: '/carrito' }} className="carrito-seguir">
                Crear cuenta nueva
              </Link>
            </div>
          )}

          <Link to="/catalogo" className="carrito-seguir">
            ← Seguir comprando
          </Link>
        </aside>
      </div>

      {mensaje && (
        <p className="carrito-mensaje" role="status">
          ✅ {mensaje}
        </p>
      )}
    </main>
  )
}

export default PaginaCarrito
