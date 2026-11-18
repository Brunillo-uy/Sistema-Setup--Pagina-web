import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import ProductoCard from './ProductoCard.jsx'
import SidebarFiltros from './SidebarFiltros.jsx'
import { obtenerFiltrosProductos, obtenerProductos } from '../api.js'

function Catalogo() {
  const [searchParams] = useSearchParams()
  const [opciones, setOpciones] = useState({
    categorias: [],
    marcas: [],
    precioMin: 0,
    precioMax: 0,
    total: 0,
  })

  const [filtros, setFiltros] = useState(() => ({
    categoria: searchParams.get('categoria') || '',
    marcas: (searchParams.get('marcas') || '')
      .split(',')
      .map((marca) => marca.trim())
      .filter(Boolean),
    chipset: searchParams.get('chipset') || '',
    buscar: searchParams.get('buscar') || '',
    precioMin: '',
    precioMax: '',
    orden: 'nombre',
  }))
  const [productos, setProductos] = useState([])
  const [total, setTotal] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    obtenerFiltrosProductos()
      .then((datos) => setOpciones(datos))
      .catch((err) => setError(err.message))
  }, [])

  useEffect(() => {
    let activo = true

    obtenerProductos(filtros)
      .then((datos) => {
        if (activo) {
          setProductos(datos.productos)
          setTotal(datos.total)
        }
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
  }, [filtros])

  const actualizarFiltros = (cambio) => {
    setCargando(true)
    setError(null)
    setFiltros(cambio)
  }

  const alCambiarCategoria = (categoria) => {
    actualizarFiltros((previos) => ({ ...previos, categoria, marcas: [], chipset: '' }))
  }

  const alAlternarMarca = (marca) => {
    actualizarFiltros((previos) => ({
      ...previos,
      marcas: previos.marcas.includes(marca)
        ? previos.marcas.filter((m) => m !== marca)
        : [...previos.marcas, marca],
    }))
  }

  const alCambiarPrecio = (campo, valor) => {
    const numero = valor === '' ? '' : Number(valor)

    if (numero !== '' && Number.isNaN(numero)) return

    actualizarFiltros((previos) => {
      const siguientes = { ...previos, [campo]: numero }
      const minimo = siguientes.precioMin === '' ? opciones.precioMin : Number(siguientes.precioMin)
      const maximo = siguientes.precioMax === '' ? opciones.precioMax : Number(siguientes.precioMax)

      if (minimo > maximo) {
        if (campo === 'precioMin') siguientes.precioMax = numero
        else siguientes.precioMin = numero
      }

      return siguientes
    })
  }

  const alLimpiar = () => {
    actualizarFiltros({
      categoria: filtros.categoria,
      marcas: [],
      chipset: '',
      buscar: '',
      precioMin: '',
      precioMax: '',
      orden: 'nombre',
    })
  }

  const alCambiarOrden = (evento) => {
    actualizarFiltros((previos) => ({ ...previos, orden: evento.target.value }))
  }

  const totalCategoria =
    opciones.categorias.find((categoria) => categoria.valor === filtros.categoria)?.total ?? opciones.total

  return (
    <main className="catalogo-container">
      <SidebarFiltros
        opciones={opciones}
        filtros={filtros}
        total={totalCategoria}
        alCambiarCategoria={alCambiarCategoria}
        alAlternarMarca={alAlternarMarca}
        alCambiarPrecio={alCambiarPrecio}
        alLimpiar={alLimpiar}
      />

      <section className="productos-seccion">
        {filtros.buscar && (
          <div className="busqueda-activa" role="status">
            <span>
              Resultados para <strong>“{filtros.buscar}”</strong>
            </span>
            <Link to={filtros.categoria ? `/catalogo?categoria=${encodeURIComponent(filtros.categoria)}` : '/catalogo'}>
              Quitar búsqueda
            </Link>
          </div>
        )}

        <div className="productos-toolbar">
          <span>{total} {total === 1 ? 'artículo' : 'artículos'}</span>

          <label className="ordenar-por">
            Ordenar por
            <select value={filtros.orden} onChange={alCambiarOrden}>
              <option value="nombre">Nombre</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
            </select>
          </label>
        </div>

        {cargando && <p className="catalogo-estado">Cargando productos...</p>}
        {error && <p className="catalogo-estado catalogo-error">No se pudieron cargar los productos: {error}</p>}

        {!cargando && !error && productos.length === 0 && (
          <p className="catalogo-estado">No hay productos con esos filtros.</p>
        )}

        <div className="productos-grid">
          {productos.map((producto) => (
            <ProductoCard key={producto._id} producto={producto} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Catalogo
