// URL base de la API, tomada del archivo .env (VITE_API_URL).
// Si no hay variable definida, usa /api (mismo servidor en producción).
const API_URL = import.meta.env.VITE_API_URL || '/api'

// GET /api/contacto -> devuelve la lista de mensajes guardados.
export async function obtenerContactos() {
  const respuesta = await fetch(`${API_URL}/contacto`)

  if (!respuesta.ok) {
    throw new Error(`Error ${respuesta.status} al obtener los contactos`)
  }

  return respuesta.json()
}

// POST /api/contacto -> guarda un mensaje del formulario.
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
