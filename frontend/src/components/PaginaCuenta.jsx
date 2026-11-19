import { Link } from 'react-router'
import { useAuth } from '../context/useAuth.js'

function PaginaCuenta() {
  const { usuario, cerrarSesion } = useAuth()

  const salir = () => {
    cerrarSesion()
  }

  const fechaRegistro = usuario.creadoEn
    ? new Date(usuario.creadoEn).toLocaleDateString('es-UY')
    : null

  return (
    <main className="auth-seccion">
      <section className="auth-tarjeta auth-cuenta">
        <h1>Mi cuenta</h1>
        <p className="auth-subtitulo">Tu sesión está activa.</p>

        <div className="auth-datos">
          <p>
            <span>Nombre</span>
            <strong>{usuario.nombre}</strong>
          </p>
          <p>
            <span>Email</span>
            <strong>{usuario.email}</strong>
          </p>
          <p>
            <span>Rol</span>
            <strong>{usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}</strong>
          </p>
          {fechaRegistro && (
            <p>
              <span>Cuenta creada</span>
              <strong>{fechaRegistro}</strong>
            </p>
          )}
        </div>

        {usuario.rol === 'admin' && (
          <Link to="/admin" className="auth-boton auth-boton-enlace">
            Ir al panel de administración
          </Link>
        )}

        <button type="button" className="auth-boton" onClick={salir}>
          Cerrar sesión
        </button>
      </section>
    </main>
  )
}

export default PaginaCuenta
