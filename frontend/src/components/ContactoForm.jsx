import { useState } from 'react'
import { enviarContacto } from '../api.js'

const formularioInicial = {
  nombre: '',
  apellido: '',
  email: '',
  fechaNacimiento: '',
  genero: 'otro',
  titulo: '',
  mensaje: '',
}

function ContactoForm() {
  const [formulario, setFormulario] = useState(formularioInicial)
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState(null)

  const manejarCambio = (evento) => {
    const { name, value } = evento.target
    setFormulario({ ...formulario, [name]: value })
  }

  const manejarEnvio = async (evento) => {
    evento.preventDefault()
    setEnviando(true)
    setResultado(null)

    try {
      const respuesta = await enviarContacto(formulario)
      setResultado({ tipo: 'ok', texto: respuesta.mensaje })
      setFormulario(formularioInicial)
    } catch (err) {
      setResultado({ tipo: 'error', texto: err.message })
    } finally {
      setEnviando(false)
    }
  }

  const reestablecer = () => {
    setFormulario(formularioInicial)
    setResultado(null)
  }

  return (
    <form className="contactoForm" onSubmit={manejarEnvio} onReset={reestablecer}>
      <label>Nombres: <input type="text" name="nombre" required id="nombre-input" value={formulario.nombre} onChange={manejarCambio} /></label><br /><br />

      <label>Apellidos: <input type="text" name="apellido" required id="apellido-input" value={formulario.apellido} onChange={manejarCambio} /></label>
      <br /><br />

      <label>Email: <input type="text" name="email" required id="email-input" value={formulario.email} onChange={manejarCambio} /></label>
      <br /><br />

      <label>Fecha de nacimiento: <input type="date" name="fechaNacimiento" min="1920-01-01" required id="bday-input" value={formulario.fechaNacimiento} onChange={manejarCambio} /></label><br /><br />

      <p>Genero:</p>
      <select name="genero" id="Genero-seleccion" value={formulario.genero} onChange={manejarCambio}>
        <option value="otro">Otro</option>
        <option value="hombre">Hombre</option>
        <option value="mujer">Mujer</option>
      </select><br /><br />

      <p>Titulo</p>
      <input type="text" name="titulo" required id="titulo-input" value={formulario.titulo} onChange={manejarCambio} /><br /><br />

      <p>Dejanos aqui tu mensaje</p>
      <textarea name="mensaje" rows="10" cols="50" required id="mensaje-input" value={formulario.mensaje} onChange={manejarCambio}></textarea>

      <br /><br />

      {resultado && (
        <p style={{ color: resultado.tipo === 'ok' ? 'green' : 'red' }}>
          {resultado.texto}
        </p>
      )}

      <input
        type="submit"
        value={enviando ? 'Enviando...' : 'Enviar'}
        disabled={enviando}
        className="boton-formulario"
        id="enviar-formulario-btn"
      />
      <br /><br />
      <input type="reset" value="Reestablecer todo" className="boton-formulario" id="reset-formulario-btn" />
    </form>
  )
}

export default ContactoForm