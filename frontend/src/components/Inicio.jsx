import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Garantias from './Garantias.jsx'
import ProductoCard from './ProductoCard.jsx'
import { obtenerProductos } from '../api.js'

const CATEGORIAS_DESTACADAS = [
  'procesadores',
  'tarjetas-video',
  'monitores',
  'perifericos',
  'mouse',
  'sillas',
  'escritorios',
  'gabinetes',
]

const MAX_PRODUCTOS_FILA = 8

function fechaProducto(producto) {
  if (producto.createdAt) {
    const fecha = new Date(producto.createdAt).getTime()

    if (!Number.isNaN(fecha)) return fecha
  }

  const id = String(producto._id || '')
  return Number.parseInt(id.slice(0, 8), 16) || 0
}

function seleccionarDestacados(productos) {
  const elegidos = []
  const ids = new Set()

  CATEGORIAS_DESTACADAS.forEach((categoria) => {
    if (elegidos.length >= MAX_PRODUCTOS_FILA) return

    const producto = productos.find(
      (item) => item.categoria === categoria && !ids.has(item._id)
    )

    if (producto) {
      elegidos.push(producto)
      ids.add(producto._id)
    }
  })

  for (const producto of productos) {
    if (elegidos.length >= MAX_PRODUCTOS_FILA) break
    if (!ids.has(producto._id)) {
      elegidos.push(producto)
      ids.add(producto._id)
    }
  }

  return elegidos
}

function seleccionarNovedades(productos, destacados) {
  const idsDestacados = new Set(destacados.map((producto) => producto._id))
  const recientes = productos
    .filter((producto) => !idsDestacados.has(producto._id))
    .sort((a, b) => fechaProducto(b) - fechaProducto(a))

  if (recientes.length >= MAX_PRODUCTOS_FILA) {
    return recientes.slice(0, MAX_PRODUCTOS_FILA)
  }

  const ids = new Set(recientes.map((producto) => producto._id))
  const relleno = [...productos]
    .filter((producto) => !ids.has(producto._id))
    .sort((a, b) => fechaProducto(b) - fechaProducto(a))

  return [...recientes, ...relleno].slice(0, MAX_PRODUCTOS_FILA)
}

function CarruselInicio({
  id,
  etiqueta,
  titulo,
  subtitulo,
  productos,
  cargando,
  error,
  ariaLabel,
  textoEnlace,
}) {
  const pistaRef = useRef(null)

  const desplazar = (direccion) => {
    const pista = pistaRef.current

    if (!pista) return

    pista.scrollBy({
      left: direccion * Math.max(pista.clientWidth * 0.8, 260),
      behavior: 'smooth',
    })
  }

  return (
    <section className="inicio-catalogo" aria-labelledby={id}>
      <div className="inicio-catalogo-encabezado">
        <div>
          <p className="inicio-catalogo-etiqueta">{etiqueta}</p>
          <h2 id={id}>{titulo}</h2>
          <p className="inicio-catalogo-subtitulo">{subtitulo}</p>
        </div>

        <div className="inicio-catalogo-acciones">
          <Link to="/catalogo" className="inicio-catalogo-ver-todo">
            {textoEnlace}
          </Link>
          <div className="inicio-catalogo-flechas">
            <button
              type="button"
              onClick={() => desplazar(-1)}
              aria-label={`Ver productos anteriores de ${titulo}`}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => desplazar(1)}
              aria-label={`Ver más productos de ${titulo}`}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {cargando && (
        <p className="inicio-catalogo-estado" role="status">
          Cargando productos...
        </p>
      )}

      {!cargando && error && (
        <p className="inicio-catalogo-estado inicio-catalogo-error" role="alert">
          No pudimos cargar los productos. <Link to="/catalogo">Ver catálogo</Link>
        </p>
      )}

      {!cargando && !error && productos.length === 0 && (
        <p className="inicio-catalogo-estado">
          Estamos preparando los próximos productos. <Link to="/catalogo">Ver catálogo</Link>
        </p>
      )}

      {!cargando && !error && productos.length > 0 && (
        <div
          className="inicio-catalogo-pista"
          ref={pistaRef}
          tabIndex={0}
          aria-label={ariaLabel}
        >
          {productos.map((producto) => (
            <div className="inicio-catalogo-item" key={producto._id}>
              <ProductoCard producto={producto} />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

function Inicio() {
  const [destacados, setDestacados] = useState([])
  const [novedades, setNovedades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    obtenerProductos({ orden: 'nombre' })
      .then((datos) => {
        if (!activo) return

        const productos = datos.productos || []
        const disponibles = productos.filter((producto) => Number(producto.stock) > 0)
        const fuente = disponibles.length > 0 ? disponibles : productos
        const filaDestacados = seleccionarDestacados(fuente)

        setDestacados(filaDestacados)
        setNovedades(seleccionarNovedades(fuente, filaDestacados))
      })
      .catch((err) => {
        if (activo) setError(err.message)
      })
      .finally(() => {
        if (activo) setCargando(false)
      })

    return () => {
      activo = false
    }
  }, [])

  return (
    <>
      <section className="banner-inicio" aria-labelledby="inicio-titulo">
        <h1 id="inicio-titulo" className="solo-lectores">
          Sistema Setup
        </h1>
        <img
          className="banner-inicio-imagen"
          src="/img/Banner-index.png"
          alt="Sistema Setup: armá tu espacio ideal para trabajar, estudiar o jugar. Computadoras, componentes, periféricos, escritorios y sillas."
          width="1983"
          height="622"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </section>

      <CarruselInicio
        id="inicio-destacados"
        etiqueta="Elegidos para vos"
        titulo="Productos destacados"
        subtitulo="Un vistazo rápido. Deslizá para descubrir más."
        productos={destacados}
        cargando={cargando}
        error={error}
        ariaLabel="Carrusel de productos destacados"
        textoEnlace="Ver catálogo completo"
      />

      <CarruselInicio
        id="inicio-novedades"
        etiqueta="Recién llegados"
        titulo="Novedades"
        subtitulo="Lo último que sumamos al catálogo."
        productos={novedades}
        cargando={cargando}
        error={error}
        ariaLabel="Carrusel de productos nuevos"
        textoEnlace="Ver todo"
      />
    </>
  )
}

export default Inicio
