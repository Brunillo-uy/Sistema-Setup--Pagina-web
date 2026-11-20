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
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminResumen from './components/admin/AdminResumen.jsx'
import AdminProductos from './components/admin/AdminProductos.jsx'
import AdminProductoForm from './components/admin/AdminProductoForm.jsx'
import AdminContactos from './components/admin/AdminContactos.jsx'
import AdminUsuarios from './components/admin/AdminUsuarios.jsx'
import { useAuth } from './context/useAuth.js'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

function RutaProducto() {
  const { id } = useParams()

  return <PaginaProducto key={id} id={id} />
}

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

function RutaAdmin({ children }) {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return (
      <main className="auth-seccion">
        <p className="auth-cargando">Cargando tu sesión...</p>
      </main>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: '/admin' }} />
  }

  if (usuario.rol !== 'admin') {
    return <Navigate to="/cuenta" replace />
  }

  return children
}

function App() {
  const { pathname } = useLocation()
  const esRutaAdmin = pathname === '/admin' || pathname.startsWith('/admin/')

  return (
    <>
      <ScrollToTop />
      {!esRutaAdmin && <Header />}
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
        <Route
          path="/admin"
          element={
            <RutaAdmin>
              <AdminLayout />
            </RutaAdmin>
          }
        >
          <Route index element={<AdminResumen />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="productos/nuevo" element={<AdminProductoForm />} />
          <Route path="productos/:id" element={<AdminProductoForm />} />
          <Route path="contactos" element={<AdminContactos />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
        <Route path="*" element={<PaginaNoEncontrada />} />
      </Routes>
      {!esRutaAdmin && <Footer />}
      {!esRutaAdmin && <Chatbot />}
    </>
  )
}

export default App
