import { useEffect, useState } from 'react'
import { useAuth } from '../../context/useAuth.js'
import {
  actualizarAdminUsuarioActivo,
  actualizarAdminUsuarioRol,
  obtenerAdminUsuarios,
} from '../../api.js'

const formatoFecha = new Intl.DateTimeFormat('es-UY', { dateStyle: 'short' })

function AdminUsuarios() {
  const { usuario: usuarioActual } = useAuth()
  const [usuarios, setUsuarios] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [page, setPage] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [rol, setRol] = useState('')
  const [activo, setActivo] = useState('')
  const [filtros, setFiltros] = useState({ buscar: '', rol: '', activo: '' })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [actualizandoId, setActualizandoId] = useState('')
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    let activoPeticion = true

    obtenerAdminUsuarios({ ...filtros, page, limit: 10 })
      .then((resultado) => {
        if (!activoPeticion) return
        setUsuarios(resultado.usuarios)
        setTotal(resultado.total)
        setPages(resultado.pages)
      })
      .catch((err) => {
        if (activoPeticion) setError(err.message)
      })
      .finally(() => {
        if (activoPeticion) setCargando(false)
      })

    return () => {
      activoPeticion = false
    }
  }, [filtros, page, recarga])

  const aplicarFiltros = (evento) => {
    evento.preventDefault()
    setCargando(true)
    setError('')
    setPage(1)
    setFiltros({ buscar: busqueda.trim(), rol, activo })
  }

  const limpiarFiltros = () => {
    setCargando(true)
    setError('')
    setBusqueda('')
    setRol('')
    setActivo('')
    setPage(1)
    setFiltros({ buscar: '', rol: '', activo: '' })
  }

  const cambiarPagina = (nuevaPagina) => {
    setCargando(true)
    setError('')
    setPage(nuevaPagina)
  }

  const cambiarRol = async (usuario, nuevoRol) => {
    try {
      setMensaje('')
      setError('')
      setActualizandoId(usuario.id)
      await actualizarAdminUsuarioRol(usuario.id, nuevoRol)
      setMensaje('Rol actualizado correctamente.')
      setCargando(true)
      setRecarga((valor) => valor + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setActualizandoId('')
    }
  }

  const cambiarActivo = async (usuario) => {
    try {
      setMensaje('')
      setError('')
      setActualizandoId(usuario.id)
      await actualizarAdminUsuarioActivo(usuario.id, !usuario.activo)
      setMensaje(usuario.activo ? 'Cuenta desactivada correctamente.' : 'Cuenta activada correctamente.')
      setCargando(true)
      setRecarga((valor) => valor + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setActualizandoId('')
    }
  }

  return (
    <>
      <header className="admin-encabezado">
        <div>
          <p className="admin-etiqueta">Cuentas</p>
          <h1>Usuarios</h1>
          <p className="admin-subtitulo">Administrá roles y el estado de las cuentas registradas.</p>
        </div>
      </header>

      {mensaje && <p className="admin-exito" role="status">{mensaje}</p>}
      {error && <p className="admin-error" role="alert">{error}</p>}

      <form className="admin-filtros" onSubmit={aplicarFiltros}>
        <input
          type="search"
          placeholder="Buscar por nombre o email"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          aria-label="Buscar usuarios"
        />
        <select value={rol} onChange={(evento) => setRol(evento.target.value)} aria-label="Filtrar por rol">
          <option value="">Todos los roles</option>
          <option value="usuario">Usuarios</option>
          <option value="admin">Administradores</option>
        </select>
        <select
          value={activo}
          onChange={(evento) => setActivo(evento.target.value)}
          aria-label="Filtrar por estado"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Desactivados</option>
        </select>
        <button type="submit" className="admin-boton">Filtrar</button>
        <button type="button" className="admin-boton-secundario" onClick={limpiarFiltros}>
          Limpiar
        </button>
      </form>

      <div className="admin-resumen-listado">
        <span>{total} {total === 1 ? 'cuenta' : 'cuentas'}</span>
        <span>Página {page} de {pages}</span>
      </div>

      {cargando ? (
        <p className="admin-cargando">Cargando usuarios...</p>
      ) : usuarios.length === 0 ? (
        <p className="admin-vacio">No hay usuarios con esos filtros.</p>
      ) : (
        <div className="admin-tabla-contenedor">
          <table className="admin-tabla">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registro</th>
                <th>Último acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => {
                const esYo = usuario.id === usuarioActual?.id

                return (
                  <tr key={usuario.id}>
                    <td>
                      <div className="admin-usuario-celda">
                        <strong>{usuario.nombre}</strong>
                        <small>{usuario.email}</small>
                      </div>
                    </td>
                    <td>
                      <select
                        value={usuario.rol}
                        disabled={esYo || actualizandoId === usuario.id}
                        onChange={(evento) => cambiarRol(usuario, evento.target.value)}
                        aria-label={`Rol de ${usuario.nombre}`}
                      >
                        <option value="usuario">Usuario</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </td>
                    <td>
                      <span className={`admin-badge ${usuario.activo ? 'admin-badge-ok' : 'admin-badge-inactivo'}`}>
                        {usuario.activo ? 'Activo' : 'Desactivado'}
                      </span>
                    </td>
                    <td>{usuario.creadoEn ? formatoFecha.format(new Date(usuario.creadoEn)) : '—'}</td>
                    <td>{usuario.ultimoAcceso ? formatoFecha.format(new Date(usuario.ultimoAcceso)) : '—'}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-boton-pequeno"
                        disabled={esYo || actualizandoId === usuario.id}
                        onClick={() => cambiarActivo(usuario)}
                      >
                        {usuario.activo ? 'Desactivar' : 'Activar'}
                      </button>
                    </td>
                  </tr>
                )
              })}
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

export default AdminUsuarios
