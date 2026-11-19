import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  actualizarAdminProducto,
  crearAdminProducto,
  obtenerAdminProducto,
} from '../../api.js'
import { ORDEN_CATEGORIAS, etiquetaCategoria } from '../../utils/categorias.js'

const formularioInicial = {
  nombre: '',
  marca: '',
  categoria: 'procesadores',
  chipset: '',
  precio: '',
  moneda: 'US$',
  stock: '0',
  imagen: '',
  descripcion: '',
  caracteristicas: '',
  socket: '',
  nucleos: '',
}

function AdminProductoForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const esEdicion = Boolean(id)
  const [formulario, setFormulario] = useState(formularioInicial)
  const [cargando, setCargando] = useState(esEdicion)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return undefined

    let activo = true

    obtenerAdminProducto(id)
      .then((producto) => {
        if (!activo) return

        setFormulario({
          nombre: producto.nombre || '',
          marca: producto.marca || '',
          categoria: producto.categoria || 'procesadores',
          chipset: producto.chipset || '',
          precio: producto.precio ?? '',
          moneda: producto.moneda || 'US$',
          stock: producto.stock ?? 0,
          imagen: producto.imagen || '',
          descripcion: producto.descripcion || '',
          caracteristicas: (producto.caracteristicas || []).join('\n'),
          socket: producto.socket || '',
          nucleos: producto.nucleos || '',
        })
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

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setFormulario((actual) => ({ ...actual, [name]: value }))
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setError('')

    const precio = Number(formulario.precio)
    const stock = Number(formulario.stock)

    if (formulario.nombre.trim().length < 3) {
      setError('El nombre debe tener al menos 3 caracteres.')
      return
    }

    if (!formulario.marca.trim()) {
      setError('La marca es obligatoria.')
      return
    }

    if (!Number.isFinite(precio) || precio < 0) {
      setError('El precio debe ser un número mayor o igual a cero.')
      return
    }

    if (!Number.isFinite(stock) || stock < 0) {
      setError('El stock debe ser un número mayor o igual a cero.')
      return
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      marca: formulario.marca.trim(),
      categoria: formulario.categoria,
      chipset: formulario.chipset.trim(),
      precio,
      moneda: formulario.moneda.trim() || 'US$',
      stock,
      imagen: formulario.imagen.trim(),
      descripcion: formulario.descripcion.trim(),
      caracteristicas: formulario.caracteristicas
        .split('\n')
        .map((item) => item.trim())
        .filter(Boolean),
      socket: formulario.socket.trim(),
      nucleos: formulario.nucleos.trim(),
    }

    setEnviando(true)

    try {
      if (esEdicion) {
        await actualizarAdminProducto(id, datos)
      } else {
        await crearAdminProducto(datos)
      }

      navigate('/admin/productos', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  if (cargando) {
    return <p className="admin-cargando">Cargando producto...</p>
  }

  return (
    <>
      <header className="admin-encabezado">
        <div>
          <p className="admin-etiqueta">Catálogo</p>
          <h1>{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h1>
          <p className="admin-subtitulo">
            {esEdicion
              ? 'Modificá los datos y guardá los cambios.'
              : 'Completá los datos para sumar un artículo al catálogo.'}
          </p>
        </div>
        <Link to="/admin/productos" className="admin-boton-secundario">
          Volver al listado
        </Link>
      </header>

      {error && <p className="admin-error" role="alert">{error}</p>}

      <form className="admin-formulario" onSubmit={manejarEnvio}>
        <label className="admin-campo admin-campo-ancho">
          Nombre
          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            maxLength={150}
            required
          />
        </label>

        <label className="admin-campo">
          Marca
          <input
            type="text"
            name="marca"
            value={formulario.marca}
            onChange={manejarCambio}
            required
          />
        </label>

        <label className="admin-campo">
          Categoría
          <select name="categoria" value={formulario.categoria} onChange={manejarCambio}>
            {ORDEN_CATEGORIAS.map((valor) => (
              <option key={valor} value={valor}>{etiquetaCategoria(valor)}</option>
            ))}
          </select>
        </label>

        <label className="admin-campo">
          Precio
          <input
            type="number"
            name="precio"
            value={formulario.precio}
            onChange={manejarCambio}
            min="0"
            step="0.01"
            required
          />
        </label>

        <label className="admin-campo">
          Moneda
          <select name="moneda" value={formulario.moneda} onChange={manejarCambio}>
            <option value="US$">US$</option>
            <option value="$U">$U</option>
            <option value="ARS">ARS</option>
          </select>
        </label>

        <label className="admin-campo">
          Stock
          <input
            type="number"
            name="stock"
            value={formulario.stock}
            onChange={manejarCambio}
            min="0"
            step="1"
            required
          />
        </label>

        <label className="admin-campo">
          Imagen
          <input
            type="text"
            name="imagen"
            value={formulario.imagen}
            onChange={manejarCambio}
            placeholder="/img/productos/mi-producto.png"
          />
        </label>

        <label className="admin-campo">
          Chipset
          <input
            type="text"
            name="chipset"
            value={formulario.chipset}
            onChange={manejarCambio}
            placeholder="amd, nvidia, etc."
          />
        </label>

        <label className="admin-campo">
          Socket
          <input
            type="text"
            name="socket"
            value={formulario.socket}
            onChange={manejarCambio}
            placeholder="AM5, LGA1700, etc."
          />
        </label>

        <label className="admin-campo">
          Núcleos
          <input
            type="text"
            name="nucleos"
            value={formulario.nucleos}
            onChange={manejarCambio}
            placeholder="8 núcleos, 16 hilos"
          />
        </label>

        <label className="admin-campo admin-campo-ancho">
          Descripción
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            rows={4}
            maxLength={2000}
          />
        </label>

        <label className="admin-campo admin-campo-ancho">
          Características
          <textarea
            name="caracteristicas"
            value={formulario.caracteristicas}
            onChange={manejarCambio}
            rows={5}
            placeholder="Una característica por línea"
          />
          <small>Una característica por línea.</small>
        </label>

        <div className="admin-formulario-acciones admin-campo-ancho">
          <button type="submit" className="admin-boton" disabled={enviando}>
            {enviando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear producto'}
          </button>
          <Link to="/admin/productos" className="admin-boton-secundario">Cancelar</Link>
        </div>
      </form>
    </>
  )
}

export default AdminProductoForm
