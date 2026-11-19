import { useEffect, useRef, useState } from 'react'
import { enviarMensajeChat } from '../api.js'

const MENSAJE_INICIAL = {
  rol: 'asistente',
  contenido:
    '¡Hola! Soy SetupBot. Te puedo ayudar con dudas sobre productos, búsqueda, carrito, cuenta y compra simulada.',
}

const SUGERENCIAS = [
  '¿Qué monitor MSI tienen?',
  '¿Cómo compro?',
  '¿La compra es real?',
  '¿Cómo busco un producto?',
  '¿Cómo creo una cuenta?',
]

function Chatbot() {
  const [abierto, setAbierto] = useState(false)
  const [mensajes, setMensajes] = useState([MENSAJE_INICIAL])
  const [texto, setTexto] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState('')

  const listaRef = useRef(null)
  const entradaRef = useRef(null)

  useEffect(() => {
    if (!abierto) return

    entradaRef.current?.focus()

    const lista = listaRef.current
    if (lista) lista.scrollTop = lista.scrollHeight
  }, [abierto])

  useEffect(() => {
    const lista = listaRef.current
    if (lista) lista.scrollTop = lista.scrollHeight
  }, [mensajes, enviando, error])

  const enviarTexto = async (valor) => {
    const consulta = valor.trim()

    if (!consulta || enviando) return

    const conversacion = [...mensajes, { rol: 'usuario', contenido: consulta }]

    setMensajes(conversacion)
    setTexto('')
    setError('')
    setEnviando(true)

    try {
      const respuesta = await enviarMensajeChat(conversacion)

      setMensajes((previos) => [
        ...previos,
        { rol: 'asistente', contenido: respuesta },
      ])
    } catch (err) {
      setError(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const alEnviar = (evento) => {
    evento.preventDefault()
    enviarTexto(texto)
  }

  return (
    <div className={`chatbot ${abierto ? 'chatbot-abierto' : ''}`}>
      {abierto && (
        <section className="chatbot-panel" id="chatbot-panel" aria-label="Asistente virtual">
          <header className="chatbot-header">
            <div>
              <strong>SetupBot</strong>
              <span>Asistente virtual de Sistema Setup</span>
            </div>
            <button
              type="button"
              className="chatbot-cerrar"
              aria-label="Cerrar asistente"
              onClick={() => setAbierto(false)}
            >
              ×
            </button>
          </header>

          <div className="chatbot-mensajes" ref={listaRef} aria-live="polite">
            {mensajes.map((mensaje, indice) => (
              <p
                key={`${mensaje.rol}-${indice}`}
                className={`chatbot-mensaje ${
                  mensaje.rol === 'usuario'
                    ? 'chatbot-mensaje-usuario'
                    : 'chatbot-mensaje-asistente'
                }`}
              >
                {mensaje.contenido}
              </p>
            ))}

            {enviando && (
              <p className="chatbot-mensaje chatbot-mensaje-asistente">
                <span className="chatbot-escribiendo">Escribiendo...</span>
              </p>
            )}

            {error && (
              <p className="chatbot-error" role="alert">
                {error}
              </p>
            )}
          </div>

          {mensajes.length === 1 && !enviando && (
            <div className="chatbot-sugerencias">
              {SUGERENCIAS.map((sugerencia) => (
                <button
                  key={sugerencia}
                  type="button"
                  onClick={() => enviarTexto(sugerencia)}
                >
                  {sugerencia}
                </button>
              ))}
            </div>
          )}

          <form className="chatbot-form" onSubmit={alEnviar}>
            <input
              ref={entradaRef}
              type="text"
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
              placeholder="Escribí tu consulta..."
              maxLength={600}
              aria-label="Consulta para el asistente"
            />
            <button type="submit" disabled={!texto.trim() || enviando}>
              Enviar
            </button>
          </form>

          <p className="chatbot-aviso">
            Asistente virtual con IA local. Puede cometer errores.
          </p>
        </section>
      )}

      <button
        type="button"
        className="chatbot-boton"
        aria-label={abierto ? 'Cerrar asistente' : 'Abrir asistente virtual'}
        aria-expanded={abierto}
        aria-controls="chatbot-panel"
        title={abierto ? 'Cerrar asistente' : '¿Necesitás ayuda?'}
        onClick={() => setAbierto(!abierto)}
      >
        {abierto ? (
          <span aria-hidden="true">×</span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
            <path d="M8 9h8M8 13h5" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default Chatbot
