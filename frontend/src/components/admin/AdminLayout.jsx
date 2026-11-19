import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../../context/useAuth.js'

const enlaces = [
  { to: '/admin', texto: 'Resumen', icono: '▦', end: true },
  { to: '/admin/productos', texto: 'Productos', icono: '▣' },
  { to: '/admin/contactos', texto: 'Mensajes', icono: '✉' },
  { to: '/admin/usuarios', texto: 'Usuarios', icono: '◉' },
]

function AdminLayout() {
  const { usuario, cerrarSesion } = useAuth()
  const navigate = useNavigate()

  const salir = () => {
    cerrarSesion()
    navigate('/', { replace: true })
  }

  return (
    <main className="admin-panel">
      <aside className="admin-sidebar">
        <div className="admin-marca">
          <span className="admin-marca-icono">SS</span>
          <div>
            <strong>Sistema Setup</strong>
            <small>Administración</small>
          </div>
        </div>

        <nav className="admin-nav" aria-label="Secciones de administración">
          {enlaces.map((enlace) => (
            <NavLink
              key={enlace.to}
              to={enlace.to}
              end={enlace.end}
              className={({ isActive }) => `admin-nav-enlace ${isActive ? 'activo' : ''}`}
            >
              <span className="admin-nav-icono" aria-hidden="true">{enlace.icono}</span>
              {enlace.texto}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-pie">
          <p className="admin-usuario">
            <span>{usuario?.nombre}</span>
            <small>{usuario?.email}</small>
          </p>
          <Link to="/" className="admin-enlace-suave">Volver a la tienda</Link>
          <button type="button" className="admin-enlace-suave admin-boton-salir" onClick={salir}>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <section className="admin-contenido">
        <Outlet />
      </section>
    </main>
  )
}

export default AdminLayout
