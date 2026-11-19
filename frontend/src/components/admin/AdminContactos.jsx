import { useEffect, useState } from 'react'
import {
  actualizarAdminContacto,
  eliminarAdminContacto,
  obtenerAdminContactos,
} from '../../api.js'

const formatoFecha = new Intl.DateTimeFormat('es-UY', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const ESTADOS = [
  { valor: 'nuevo', etiqueta: 'Nuevo' },
  { valor: 'leido', etiqueta: 'Leído' },
  { valor: 'respondido', etiqueta: 'Respondido' },
]

function AdminContactos() {
  const [contactos, setContactos] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('')
  const [filtros, setFiltros] = useState({ buscar: '', estado: '' })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [actualizandoId, setActualizandoId] = useState('')
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    let activo = true

    obtenerAdminContactos({ ...filtros, page, limit: 10 })
      .then((resultado) => {
        if (!activo) return
        setContactos(resultado.contactos)
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
    setFiltros({ buscar: busqueda.trim(), estado })
  }

  const limpiarFiltros = () => {
    setCargando(true)
    setError('')
    setBusqueda('')
    setEstado('')
    setPage(1)
    setFiltros({ buscar: '', estado: '' })
  }

  const cambiarPagina = (nuevaPagina) => {
    setCargando(true)
    setError('')
    setPage(nuevaPagina)
  }

  const cambiarEstado = async (contacto, nuevoEstado) => {
    try {
      setMensaje('')
      setError('')
      setActualizandoId(contacto._id)
      await actualizarAdminContacto(contacto._id, { estado: nuevoEstado })
      setMensaje('Estado actualizado correctamente.')
      setCargando(true)
      setRecarga((valor) => valor + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setActualizandoId('')
    }
  }

  const eliminarContacto = async (contacto) => {
    const confirmado = window.confirm(
      `¿Eliminar el mensaje "${contacto.titulo}" de ${contacto.nombre}?`
    )

    if (!confirmado) return

    try {
      setMensaje('')
      setError('')
      await eliminarAdminContacto(contacto._id)
      setMensaje('Mensaje eliminado correctamente.')
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
          <p className="admin-etiqueta">Atención al cliente</p>
          <h1>Mensajes</h1>
          <p className="admin-subtitulo">Revisá las consultas enviadas desde el formulario de contacto.</p>
        </div>
      </header>

      {mensaje && <p className="admin-exito" role="status">{mensaje}</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}

      <form className="admin-filtros" onSubmit={aplicarFiltros}>
        <input
          type="search"
          placeholder="Buscar por nombre, email o asunto"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          aria-label="Buscar mensajes"
        />
        <select
          value={estado}
          onChange={(evento) => setEstado(evento.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
          ))}
        </select>
        <button type="submit" className="admin-boton">Filtrar</button>
        <button type="button" className="admin-boton-secundario" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </form>

      <div className="admin-resumen-listado">
        <span>{total} {total === 1 ? 'mensaje' : 'mensajes'}</span>
        <span>Página {page} de {pages}</span>
      </div>

      {cargando ? (
        <p className="admin-cargando">Cargando mensajes...</p>
      ) : contactos.length === 0 ? (
        <p className="admin-vacio">No hay mensajes con esos filtros.</p>
      ) : (
        <div className="admin-lista-contactos">
          {contactos.map((contacto) => (
            <article className="admin-mensaje" key={contacto._id}>
              <div className="admin-mensaje-encabezado">
                <div>
                  <h2>{contacto.titulo}</h2>
                  <p>
                    {contacto.nombre} {contacto.apellido} · {contacto.email}
                  </p>
                </div>
                <div className="admin-mensaje-meta">
                  <span className={`admin-badge admin-badge-${contacto.estado}`}>
                    {contacto.estado}
                  </span>
                  <small>{formatoFecha.format(new Date(contacto.createdAt))}</small>
                </div>
              </div>

              <p className="admin-mensaje-texto">{contacto.mensaje}</p>

              <div className="admin-mensaje-acciones">
                <label>
                  Estado
                  <select
                    value={contacto.estado}
                    disabled={actualizandoId === contacto._id}
                    onChange={(evento) => cambiarEstado(contacto, evento.target.value)}
                  >
                    {ESTADOS.map((opcion) => (
                      <option key={opcion.valor} value={opcion.valor}>
                        {opcion.etiqueta}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="admin-boton-pequeno admin-boton-peligro"
                  onClick={() => eliminarContacto(contacto)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
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

export default AdminContactos
