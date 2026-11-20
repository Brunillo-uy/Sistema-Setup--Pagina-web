const API_URL = import.meta.env.VITE_API_URL || '/api'

const TOKEN_KEY = 'sistema_setup_token'

export function guardarToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function leerToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function borrarToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export async function enviarContacto(datos) {
  const respuesta = await fetch(`${API_URL}/contacto`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || 'No se pudo enviar el mensaje')
  }

  return resultado
}

function construirQuery(filtros = {}) {
  const params = new URLSearchParams()

  if (filtros.categoria) params.set('categoria', filtros.categoria)
  if (filtros.marcas?.length) params.set('marcas', filtros.marcas.join(','))
  if (filtros.chipset) params.set('chipset', filtros.chipset)
  if (filtros.precioMin !== '' && filtros.precioMin != null) {
    params.set('precioMin', filtros.precioMin)
  }
  if (filtros.precioMax !== '' && filtros.precioMax != null) {
    params.set('precioMax', filtros.precioMax)
  }
  if (filtros.buscar) params.set('buscar', filtros.buscar)
  if (filtros.orden) params.set('orden', filtros.orden)

  const query = params.toString()
  return query ? `?${query}` : ''
}

export async function obtenerProductos(filtros = {}) {
  const respuesta = await fetch(`${API_URL}/productos${construirQuery(filtros)}`)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los productos`)
  }

  return respuesta.json()
}

export async function obtenerFiltrosProductos() {
  const respuesta = await fetch(`${API_URL}/productos/filtros`)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los filtros`)
  }

  return respuesta.json()
}

export async function obtenerProducto(id) {
  const respuesta = await fetch(`${API_URL}/productos/${id}`)
  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || `Error ${respuesta.status} al obtener el producto`)
  }

  return resultado.producto
}

export async function registrarUsuario(datos) {
  const respuesta = await fetch(`${API_URL}/auth/registro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || 'No se pudo crear la cuenta')
  }

  return resultado
}

export async function iniciarSesionUsuario(datos) {
  const respuesta = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || 'No se pudo iniciar sesión')
  }

  return resultado
}

export async function enviarMensajeChat(mensajes) {
  const respuesta = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mensajes }),
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || 'No se pudo consultar al asistente')
  }

  return resultado.respuesta
}

export async function obtenerPerfil() {
  const token = leerToken()

  if (!token) {
    throw new Error('No hay una sesión guardada')
  }

  const respuesta = await fetch(`${API_URL}/auth/perfil`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const resultado = await respuesta.json()

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || 'La sesión no es válida')
  }

  return resultado.usuario
}

function construirQueryAdmin(filtros = {}) {
  const params = new URLSearchParams()

  if (filtros.buscar) params.set('buscar', filtros.buscar)
  if (filtros.categoria) params.set('categoria', filtros.categoria)
  if (filtros.estado) params.set('estado', filtros.estado)
  if (filtros.rol) params.set('rol', filtros.rol)
  if (filtros.activo !== '' && filtros.activo != null) {
    params.set('activo', filtros.activo)
  }
  if (filtros.page) params.set('page', filtros.page)
  if (filtros.limit) params.set('limit', filtros.limit)

  const query = params.toString()
  return query ? `?${query}` : ''
}

async function pedirAdmin(ruta, opciones = {}) {
  const token = leerToken()
  const headers = {
    ...(opciones.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(opciones.headers || {}),
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers,
  })

  const resultado = await respuesta.json().catch(() => ({}))

  if (!respuesta.ok) {
    throw new Error(resultado.mensaje || `Error ${respuesta.status} en el panel`)
  }

  return resultado
}

export function obtenerAdminResumen() {
  return pedirAdmin('/admin/resumen')
}

export function obtenerAdminProductos(filtros = {}) {
  return pedirAdmin(`/admin/productos${construirQueryAdmin(filtros)}`)
}

export async function obtenerAdminProducto(id) {
  const resultado = await pedirAdmin(`/admin/productos/${id}`)
  return resultado.producto
}

export function crearAdminProducto(datos) {
  return pedirAdmin('/admin/productos', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export function actualizarAdminProducto(id, datos) {
  return pedirAdmin(`/admin/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}

export function eliminarAdminProducto(id) {
  return pedirAdmin(`/admin/productos/${id}`, {
    method: 'DELETE',
  })
}

export function obtenerAdminContactos(filtros = {}) {
  return pedirAdmin(`/admin/contactos${construirQueryAdmin(filtros)}`)
}

export function actualizarAdminContacto(id, datos) {
  return pedirAdmin(`/admin/contactos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export function eliminarAdminContacto(id) {
  return pedirAdmin(`/admin/contactos/${id}`, {
    method: 'DELETE',
  })
}

export function obtenerAdminUsuarios(filtros = {}) {
  return pedirAdmin(`/admin/usuarios${construirQueryAdmin(filtros)}`)
}

export function actualizarAdminUsuarioRol(id, rol) {
  return pedirAdmin(`/admin/usuarios/${id}/rol`, {
    method: 'PATCH',
    body: JSON.stringify({ rol }),
  })
}

export function actualizarAdminUsuarioActivo(id, activo) {
  return pedirAdmin(`/admin/usuarios/${id}/activo`, {
    method: 'PATCH',
    body: JSON.stringify({ activo }),
  })
}
