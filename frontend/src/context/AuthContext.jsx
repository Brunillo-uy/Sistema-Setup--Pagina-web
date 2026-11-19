import { useEffect, useState } from 'react'
import {
  borrarToken,
  guardarToken,
  iniciarSesionUsuario,
  leerToken,
  obtenerPerfil,
  registrarUsuario,
} from '../api.js'
import { AuthContext } from './useAuth.js'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Al recargar la página, valida el token guardado.
  useEffect(() => {
    let activo = true

    const cargarSesion = async () => {
      if (!leerToken()) {
        if (activo) setCargando(false)
        return
      }

      try {
        const perfil = await obtenerPerfil()
        if (activo) setUsuario(perfil)
      } catch {
        borrarToken()
        if (activo) setUsuario(null)
      } finally {
        if (activo) setCargando(false)
      }
    }

    cargarSesion()

    return () => {
      activo = false
    }
  }, [])

  const iniciarSesion = async (datos) => {
    const resultado = await iniciarSesionUsuario(datos)
    guardarToken(resultado.token)
    setUsuario(resultado.usuario)
    return resultado.usuario
  }

  const registrar = async (datos) => {
    const resultado = await registrarUsuario(datos)
    guardarToken(resultado.token)
    setUsuario(resultado.usuario)
    return resultado.usuario
  }

  const cerrarSesion = () => {
    borrarToken()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider
      value={{ usuario, cargando, iniciarSesion, registrar, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  )
}
