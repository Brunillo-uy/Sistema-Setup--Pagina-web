import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { obtenerAdminResumen } from '../../api.js'

const formatoFecha = new Intl.DateTimeFormat('es-UY', {
  dateStyle: 'short',
  timeStyle: 'short',
})

function AdminResumen() {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true

    obtenerAdminResumen()
      .then((resultado) => {
        if (activo) setDatos(resultado)
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
  }, [])

  if (cargando) {
    return <p className="admin-cargando">Cargando resumen...</p>
  }

  if (error) {
    return <p className="admin-error" role="alert">{error}</p>
  }

  const resumen = datos?.resumen || {}

  return (
    <>
      <header className="admin-encabezado">
        <div>
          <p className="admin-etiqueta">Panel interno</p>
          <h1>Resumen general</h1>
          <p className="admin-subtitulo">Una vista rápida del estado de la tienda.</p>
        </div>
      </header>

      <section className="admin-tarjetas" aria-label="Métricas principales">
        <article className="admin-tarjeta">
          <span className="admin-tarjeta-icono">▣</span>
          <p>Productos</p>
          <strong>{resumen.productos ?? 0}</strong>
          <Link to="/admin/productos">Gestionar</Link>
        </article>

        <article className="admin-tarjeta admin-tarjeta-alerta">
          <span className="admin-tarjeta-icono">!</span>
          <p>Stock bajo</p>
          <strong>{resumen.stockBajo ?? 0}</strong>
          <Link to="/admin/productos">Revisar inventario</Link>
        </article>

        <article className="admin-tarjeta">
          <span className="admin-tarjeta-icono">◉</span>
          <p>Usuarios</p>
          <strong>{resumen.usuarios ?? 0}</strong>
          <Link to="/admin/usuarios">Ver usuarios</Link>
        </article>

        <article className="admin-tarjeta">
          <span className="admin-tarjeta-icono">✉</span>
          <p>Mensajes nuevos</p>
          <strong>{resumen.mensajesNuevos ?? 0}</strong>
          <Link to="/admin/contactos">Abrir bandeja</Link>
        </article>
      </section>

      <div className="admin-doble-columna">
        <section className="admin-bloque">
          <div className="admin-bloque-encabezado">
            <h2>Stock bajo</h2>
            <Link to="/admin/productos">Ver productos</Link>
          </div>

          {datos?.productosStockBajo?.length ? (
            <div className="admin-tabla-contenedor">
              <table className="admin-tabla">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.productosStockBajo.map((producto) => (
                    <tr key={producto._id}>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>
                        <span className="admin-badge admin-badge-alerta">{producto.stock}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="admin-vacio">No hay productos con stock bajo.</p>
          )}
        </section>

        <section className="admin-bloque">
          <div className="admin-bloque-encabezado">
            <h2>Últimos mensajes</h2>
            <Link to="/admin/contactos">Ver bandeja</Link>
          </div>

          {datos?.ultimosMensajes?.length ? (
            <ul className="admin-lista-mensajes">
              {datos.ultimosMensajes.map((contacto) => (
                <li key={contacto._id}>
                  <div>
                    <strong>{contacto.titulo}</strong>
                    <p>{contacto.nombre} {contacto.apellido} · {contacto.email}</p>
                  </div>
                  <span className={`admin-badge admin-badge-${contacto.estado}`}>
                    {contacto.estado}
                  </span>
                  <small>{formatoFecha.format(new Date(contacto.createdAt))}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-vacio">Todavía no hay mensajes.</p>
          )}
        </section>
      </div>
    </>
  )
}

export default AdminResumen
