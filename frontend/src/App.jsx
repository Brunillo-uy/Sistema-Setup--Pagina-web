import Footer from './components/Footer.jsx'
import Garantias from './components/Garantias.jsx'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Catalogo from './components/Catalogo.jsx'
import ContactoForm from './components/ContactoForm.jsx'



function App() {
  return (
    <>
      <Header />
      <Hero titulo="Inicio" />
      <Garantias />
      <Catalogo />
      <ContactoForm />
      <Footer />
    </>
  )
}

export default App
