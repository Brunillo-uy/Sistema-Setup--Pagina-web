import { useState } from 'react'
import { etiquetaCategoria, ORDEN_CATEGORIAS } from '../utils/categorias.js'
import { etiquetaMarca } from '../utils/marcas.js'

function SidebarFiltros({
  opciones,
  filtros,
  total,
  alCambiarCategoria,
  alAlternarMarca,
  alCambiarPrecio,
  alLimpiar,
}) {
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false)
  const categoriaBase = filtros.categoria
    ? etiquetaCategoria(filtros.categoria)
    : 'Todos los productos'
  const categoriaConBusqueda = filtros.buscar
    ? `Resultados para “${filtros.buscar}”`
    : categoriaBase
  const tituloCategoria = filtros.chipset
    ? `${categoriaConBusqueda} · ${filtros.chipset.toUpperCase()}`
    : categoriaConBusqueda
  const precioMin = filtros.precioMin === '' ? opciones.precioMin : Number(filtros.precioMin)
  const precioMax = filtros.precioMax === '' ? opciones.precioMax : Number(filtros.precioMax)
  const categoriasOrdenadas = [...opciones.categorias].sort((a, b) => {
    const posicionA = ORDEN_CATEGORIAS.indexOf(a.valor)
    const posicionB = ORDEN_CATEGORIAS.indexOf(b.valor)

    return (posicionA === -1 ? 99 : posicionA) - (posicionB === -1 ? 99 : posicionB)
  })
  const filtrosActivos = [
    filtros.categoria,
    filtros.buscar,
    filtros.chipset,
    filtros.marcas.length > 0,
    filtros.precioMin !== '' || filtros.precioMax !== '',
  ].filter(Boolean).length

  return (
    <aside className="sidebar-filtros">
      <p className="breadcrumbs">
        Inicio / Catálogo / {tituloCategoria}
      </p>
      <h1>{tituloCategoria}</h1>

      <button
        type="button"
        className="sidebar-filtros-toggle"
        aria-expanded={filtrosAbiertos}
        aria-controls="filtros-catalogo"
        onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
      >
        <span>{filtrosAbiertos ? 'Ocultar filtros' : 'Mostrar filtros'}</span>
        <span className="sidebar-filtros-resumen">
          {filtrosActivos > 0
            ? `${filtrosActivos} ${filtrosActivos === 1 ? 'filtro activo' : 'filtros activos'}`
            : 'Categoría, marcas y precio'}
        </span>
        <span className="sidebar-filtros-icono" aria-hidden="true">
          {filtrosAbiertos ? '▲' : '▼'}
        </span>
      </button>

      <div
        id="filtros-catalogo"
        className={`sidebar-filtros-contenido ${filtrosAbiertos ? 'abierto' : ''}`}
      >
        <div className="filtro-grupo">
        <div className="filtro-titulo-fila">
          <h3>Categoría</h3>
          <span className="filtro-cantidad">{total} artículos</span>
        </div>

        <ul className="filtro-categorias">
          <li>
            <button
              type="button"
              className={`filtro-categoria ${filtros.categoria === '' ? 'activa' : ''}`}
              onClick={() => alCambiarCategoria('')}
            >
              <span>Todos</span>
              <span className="filtro-cantidad">{opciones.total}</span>
            </button>
          </li>

          {categoriasOrdenadas.map((categoria) => (
            <li key={categoria.valor}>
              <button
                type="button"
                className={`filtro-categoria ${filtros.categoria === categoria.valor ? 'activa' : ''}`}
                onClick={() => alCambiarCategoria(categoria.valor)}
              >
                <span>{etiquetaCategoria(categoria.valor)}</span>
                <span className="filtro-cantidad">{categoria.total}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="filtro-grupo">
        <h3>Marcas</h3>

        {opciones.marcas.map((marca) => (
          <label key={marca.valor} className="filtro-checkbox">
            <input
              type="checkbox"
              checked={filtros.marcas.includes(marca.valor)}
              onChange={() => alAlternarMarca(marca.valor)}
            />
            <span>{etiquetaMarca(marca.valor)}</span>
            <span className="filtro-cantidad">{marca.total}</span>
          </label>
        ))}
      </div>

      <div className="filtro-grupo">
        <h3>Precio</h3>

        <div className="rango-etiquetas">
          <span>{precioMin} US$</span>
          <span>{precioMax} US$</span>
        </div>

        <div className="rango-controles">
          <input
            type="range"
            min={opciones.precioMin}
            max={opciones.precioMax}
            value={precioMin}
            onChange={(evento) => alCambiarPrecio('precioMin', evento.target.value)}
            aria-label="Precio mínimo"
          />
          <input
            type="range"
            min={opciones.precioMin}
            max={opciones.precioMax}
            value={precioMax}
            onChange={(evento) => alCambiarPrecio('precioMax', evento.target.value)}
            aria-label="Precio máximo"
          />
        </div>

        <div className="precio-inputs">
          <label>
            Min
            <input
              type="number"
              min={opciones.precioMin}
              max={opciones.precioMax}
              value={filtros.precioMin}
              placeholder={String(opciones.precioMin)}
              onChange={(evento) => alCambiarPrecio('precioMin', evento.target.value)}
            />
          </label>
          <label>
            Max
            <input
              type="number"
              min={opciones.precioMin}
              max={opciones.precioMax}
              value={filtros.precioMax}
              placeholder={String(opciones.precioMax)}
              onChange={(evento) => alCambiarPrecio('precioMax', evento.target.value)}
            />
          </label>
          <button type="button" className="boton-limpiar" onClick={alLimpiar} title="Limpiar filtros">
            ↺
          </button>
        </div>
      </div>
      </div>
    </aside>
  )
}

export default SidebarFiltros
