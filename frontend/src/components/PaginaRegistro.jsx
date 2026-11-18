import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth.js'

const formularioInicial = {
  nombre: '',
  email: '',
  password: '',
  confirmarPassword: '',
}

function PaginaRegistro() {
  const { usuario, registrar } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [formulario, setFormulario] = useState(formularioInicial)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  if (usuario) {
    return <Navigate to={location.state?.desde || '/cuenta'} replace />
  }

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setFormulario({ ...formulario, [name]: value })
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setError('')

    if (formulario.nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres')
      return
    }

    if (formulario.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }

    if (formulario.password !== formulario.confirmarPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setEnviando(true)

    try {
      await registrar({
        nombre: formulario.nombre.trim(),
        email: formulario.email.trim(),
        password: formulario.password,
      })
      navigate(location.state?.desde || '/cuenta', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="auth-seccion">
      <section className="auth-tarjeta">
        <h1>Crear cuenta</h1>
        <p className="auth-subtitulo">
          Registrate en segundos y empezá a armar tu setup ideal.
        </p>

        <form className="auth-form" onSubmit={manejarEnvio}>
          <label className="auth-campo">
            Nombre
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              autoComplete="name"
              placeholder="Tu nombre"
              minLength={2}
              maxLength={80}
              required
            />
          </label>

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
              autoComplete="new-password"
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              required
            />
          </label>

          <label className="auth-campo">
            Confirmar contraseña
            <input
              type="password"
              name="confirmarPassword"
              value={formulario.confirmarPassword}
              onChange={manejarCambio}
              autoComplete="new-password"
              placeholder="Repetí tu contraseña"
              minLength={8}
              required
            />
          </label>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="auth-boton" disabled={enviando}>
            {enviando ? 'Creando cuenta...' : 'Crear mi cuenta'}
          </button>
        </form>

        <p className="auth-pie">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" state={location.state}>Iniciar sesión</Link>
        </p>
      </section>
    </main>
  )
}

export default PaginaRegistro
