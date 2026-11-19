import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Inicio from './components/Inicio.jsx'
import PaginaCatalogo from './components/PaginaCatalogo.jsx'
import PaginaMonitores from './components/PaginaMonitores.jsx'
import PaginaContacto from './components/PaginaContacto.jsx'
import PaginaProducto from './components/PaginaProducto.jsx'
import PaginaNoEncontrada from './components/PaginaNoEncontrada.jsx'
import PaginaCarrito from './components/PaginaCarrito.jsx'
import PaginaLogin from './components/PaginaLogin.jsx'
import PaginaRegistro from './components/PaginaRegistro.jsx'
import PaginaCuenta from './components/PaginaCuenta.jsx'
import Chatbot from './components/Chatbot.jsx'
import { useAuth } from './context/useAuth.js'

// Al cambiar de ruta, la página vuelve arriba.
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Fuerza el remontaje de la página al cambiar de producto.
function RutaProducto() {
  const { id } = useParams()

  return <PaginaProducto key={id} id={id} />
}

// Solo deja entrar a la cuenta si hay una sesión activa.
function RutaProtegida({ children }) {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return (
      <main className="auth-seccion">
        <p className="auth-cargando">Cargando tu sesión...</p>
      </main>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: '/cuenta' }} />
  }

  return children
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/catalogo" element={<PaginaCatalogo />} />
        <Route path="/monitores" element={<PaginaMonitores />} />
        <Route path="/contacto" element={<PaginaContacto />} />
        <Route path="/carrito" element={<PaginaCarrito />} />
        <Route path="/login" element={<PaginaLogin />} />
        <Route path="/registro" element={<PaginaRegistro />} />
        <Route
          path="/cuenta"
          element={
            <RutaProtegida>
              <PaginaCuenta />
            </RutaProtegida>
          }
        />
        <Route path="/producto/:id" element={<RutaProducto />} />
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
      <Footer />
      <Chatbot />
    </>
  )
}

export default App
