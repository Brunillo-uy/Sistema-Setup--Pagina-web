function ContactoForm() {
  return (
    <form className="contactoForm">
      <label>Nombres: <input type="text" name="Nombre" required id="nombre-input" /></label><br /><br />

      <label>Apellidos: <input type="text" name="Apellido" required id="apellido-input" /></label>
      <br /><br />

      <label>Email: <input type="text" name="Email" required id="email-input" /></label>
      <br /><br />

      <label>Fecha de nacimiento: <input type="date" name="bday" min="1920-01-01" required id="bday-input" /></label><br /><br />

      <p>Genero:</p>
      <select name="Genero" id="Genero-seleccion" defaultValue="otro">
        <option value="otro">Otro</option>
        <option value="hombre">Hombre</option>
        <option value="mujer">Mujer</option>
      </select><br /><br />

      <p>Titulo</p>
      <input type="text" name="titulo" required id="titulo-input" /><br /><br />

      <p>Dejanos aqui tu mensaje</p>
      <textarea name="mensaje" rows="10" cols="50" required id="mensaje-input"></textarea>

      <br /><br />
      <input type="submit" value="Enviar" className="boton-formulario" id="enviar-formulario-btn" />
      <br /><br />
      <input type="reset" value="Reestablecer todo" className="boton-formulario" id="reset-formulario-btn" />
    </form>
  )
}

export default ContactoForm
