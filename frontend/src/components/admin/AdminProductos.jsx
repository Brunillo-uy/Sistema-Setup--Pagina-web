import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { eliminarAdminProducto, obtenerAdminProductos } from '../../api.js'
import { ORDEN_CATEGORIAS, etiquetaCategoria } from '../../utils/categorias.js'

const formatearPrecio = (valor, moneda = 'US$') => `${valor} ${moneda}`

function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('')
  const [filtros, setFiltros] = useState({ buscar: '', categoria: '' })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    let activo = true

    obtenerAdminProductos({ ...filtros, page, limit: 10 })
      .then((resultado) => {
        if (!activo) return
        setProductos(resultado.productos)
        setTotal(resultado.total)
        setPages(resultado.pages)
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
  }, [filtros, page, recarga])

  const aplicarFiltros = (evento) => {
    evento.preventDefault()
    setCargando(true)
    setError('')
    setPage(1)
    setFiltros({
      buscar: busqueda.trim(),
      categoria,
    })
  }

  const limpiarFiltros = () => {
    setCargando(true)
    setError('')
    setBusqueda('')
    setCategoria('')
    setPage(1)
    setFiltros({ buscar: '', categoria: '' })
  }

  const cambiarPagina = (nuevaPagina) => {
    setCargando(true)
    setError('')
    setPage(nuevaPagina)
  }

  const eliminarProducto = async (producto) => {
    const confirmado = window.confirm(
      `¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`
    )

    if (!confirmado) return

    try {
      setMensaje('')
      setError('')
      await eliminarAdminProducto(producto._id)
      setMensaje('Producto eliminado correctamente.')
      setCargando(true)
      setPage(1)
      setRecarga((valor) => valor + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <header className="admin-encabezado">
        <div>
          <p className="admin-etiqueta">Catálogo</p>
          <h1>Productos</h1>
          <p className="admin-subtitulo">Creá, editá y eliminá artículos del catálogo.</p>
        </div>
        <Link to="/admin/productos/nuevo" className="admin-boton">
          + Nuevo producto
        </Link>
      </header>

      {mensaje && <p className="admin-exito" role="status">{mensaje}</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}

      <form className="admin-filtros" onSubmit={aplicarFiltros}>
        <input
          type="search"
          placeholder="Buscar por nombre, marca o categoría"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          aria-label="Buscar productos"
        />
        <select
          value={categoria}
          onChange={(evento) => setCategoria(evento.target.value)}
          aria-label="Filtrar por categoría"
        >
          <option value="">Todas las categorías</option>
          {ORDEN_CATEGORIAS.map((valor) => (
            <option key={valor} value={valor}>{etiquetaCategoria(valor)}</option>
          ))}
        </select>
        <button type="submit" className="admin-boton">Filtrar</button>
        <button type="button" className="admin-boton-secundario" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </form>

      <div className="admin-resumen-listado">
        <span>{total} {total === 1 ? 'producto' : 'productos'}</span>
        <span>Página {page} de {pages}</span>
      </div>

      {cargando ? (
        <p className="admin-cargando">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="admin-vacio">No encontramos productos con esos filtros.</p>
      ) : (
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto._id}>
                  <td>
                    <div className="admin-producto-celda">
                      <img
                        src={producto.imagen || '/img/productos/placeholder.svg'}
                        alt=""
                        className="admin-miniatura"
                        onError={(evento) => {
                          evento.currentTarget.onerror = null
                          evento.currentTarget.src = '/img/productos/placeholder.svg'
                        }}
                      />
                      <div>
                        <strong>{producto.nombre}</strong>
                        <small>{producto.marca}</small>
                      </div>
                    </div>
                  </td>
                  <td>{etiquetaCategoria(producto.categoria)}</td>
                  <td>{formatearPrecio(producto.precio, producto.moneda)}</td>
                  <td>
                    <span className={`admin-badge ${producto.stock <= 3 ? 'admin-badge-alerta' : 'admin-badge-ok'}`}>
                      {producto.stock}
                    </span>
                  </td>
                  <td>
                    <div className="admin-acciones">
                      <Link
                        to={`/admin/productos/${producto._id}`}
                        className="admin-boton-pequeno"
                      >
                        Editar
                      </Link>
                      <button
                        type="button"
                        className="admin-boton-pequeno admin-boton-peligro"
                        onClick={() => eliminarProducto(producto)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-paginacion">
        <button
          type="button"
          className="admin-boton-secundario"
          disabled={page <= 1}
          onClick={() => cambiarPagina(Math.max(1, page - 1))}
        >
          Anterior
        </button>
        <span>Página {page} de {pages}</span>
        <button
          type="button"
          className="admin-boton-secundario"
          disabled={page >= pages}
          onClick={() => cambiarPagina(Math.min(pages, page + 1))}
        >
          Siguiente
        </button>
      </div>
    </>
  )
}

export default AdminProductos
