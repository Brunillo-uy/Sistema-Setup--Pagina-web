import { useState } from 'react'
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
  const manejarCambio = (evento) => {
    const {name, value } = evento.target
    setFormulario({...formulario, [name]: value,
    })
  }
  const manejarEnvio = (evento) => {
    evento.preventDefault()
  }
  const reestablecer = () => {
    setFormulario(formularioInicial)
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
      <input type="submit" value="Enviar" className="boton-formulario" id="enviar-formulario-btn" />
      <br /><br />
      <input type="reset" value="Reestablecer todo" className="boton-formulario" id="reset-formulario-btn" />
    </form>
  )
}

export default ContactoForm