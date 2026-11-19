import ContactoForm from './ContactoForm.jsx'

function PaginaContacto() {
  return (
    <main className="contacto-seccion">
      <section className="contacto-columna-izquierda">
        <h1>¡Contactanos!</h1>
        <img src="/img/Contactanos.png" alt="Ilustración de contacto" className="contacto_imagen" />
      </section>
      <section className="contacto-columna-derecha">
        <ContactoForm />
      </section>
    </main>
  )
}

export default PaginaContacto
