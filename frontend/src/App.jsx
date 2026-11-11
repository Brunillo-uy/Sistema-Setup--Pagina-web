import { useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Inicio from './components/Inicio.jsx'
import PaginaCatalogo from './components/PaginaCatalogo.jsx'
import PaginaMonitores from './components/PaginaMonitores.jsx'
import PaginaContacto from './components/PaginaContacto.jsx'


function App() {
  const [paginaActiva, setPaginaActiva] = useState('inicio')
  return (
    <>
      <Header alNavegar={setPaginaActiva} />
      {paginaActiva === 'inicio' && <Inicio />}
      {paginaActiva === 'catalogo' && <PaginaCatalogo />}
      {paginaActiva === 'monitores' && <PaginaMonitores />}
      {paginaActiva === 'contacto' && <PaginaContacto />}
      <Footer />
    </>
  )
}

export default App
