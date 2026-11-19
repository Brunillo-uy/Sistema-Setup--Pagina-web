import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth.js'

function PaginaLogin() {
  const { usuario, iniciarSesion } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formulario, setFormulario] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (usuario) {
    const destino = location.state?.desde || (usuario.rol === 'admin' ? '/admin' : '/cuenta')
    return <Navigate to={destino} replace />
  }

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setFormulario({ ...formulario, [name]: value })
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      const usuarioLogueado = await iniciarSesion(formulario)
      const destino = location.state?.desde || (usuarioLogueado.rol === 'admin' ? '/admin' : '/cuenta')
      navigate(destino, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="auth-seccion">
      <section className="auth-tarjeta">
        <h1>Iniciar sesión</h1>
        <p className="auth-subtitulo">
          Entra a tu cuenta para guardar tus datos y seguir comprando.
        </p>

        <form className="auth-form" onSubmit={manejarEnvio}>
          <label className="auth-campo">
            Email
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={manejarCambio}
              autoComplete="email"
              placeholder="tu@email.com"
              required
            />
          </label>

          <label className="auth-campo">
            Contraseña
            <input
              type="password"
              name="password"
              value={formulario.password}
              onChange={manejarCambio}
              autoComplete="current-password"
              placeholder="Tu contraseña"
              required
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-boton" disabled={enviando}>
            {enviando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="auth-pie">
          ¿Todavía no tienes cuenta?{' '}
          <Link to="/registro" state={location.state}>Crear cuenta</Link>
        </p>
      </section>
    </main>
  )
}

export default PaginaLogin
