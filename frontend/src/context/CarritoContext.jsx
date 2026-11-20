import { useEffect, useState } from 'react'
import { CarritoContext } from './useCarrito.js'

const CLAVE_CARRITO = 'sistema_setup_carrito'

function normalizarItem(item) {
  return {
    id: String(item._id || item.id),
    nombre: item.nombre || 'Producto',
    precio: Number(item.precio) || 0,
    moneda: item.moneda || 'US$',
    imagen: item.imagen || '/img/productos/placeholder.svg',
    stock: Math.max(0, Math.trunc(Number(item.stock) || 0)),
    cantidad: Math.max(1, Math.trunc(Number(item.cantidad) || 1)),
  }
}

function leerCarritoGuardado() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || '[]')

    if (!Array.isArray(datos)) return []

    return datos
      .filter((item) => item && (item.id || item._id) && Number(item.cantidad) > 0)
      .map(normalizarItem)
  } catch {
    return []
  }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarritoGuardado)

  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
    } catch {
    }
  }, [items])

  const agregarProducto = (producto, cantidad = 1) => {
    const item = normalizarItem({ ...producto, cantidad })
    const existente = items.find((guardado) => guardado.id === item.id)
    const cantidadActual = existente?.cantidad || 0
    const stock = item.stock
    const pedidas = Math.max(1, Math.trunc(Number(cantidad) || 1))
    const disponibles = Math.max(0, stock - cantidadActual)
    const agregadas = Math.min(pedidas, disponibles)

    if (agregadas <= 0) {
      return { agregadas: 0, enCarrito: cantidadActual }
    }

    const nuevaCantidad = cantidadActual + agregadas

    setItems((actuales) => {
      if (actuales.some((guardado) => guardado.id === item.id)) {
        return actuales.map((guardado) =>
          guardado.id === item.id
            ? { ...guardado, ...item, cantidad: nuevaCantidad }
            : guardado,
        )
      }

      return [...actuales, { ...item, cantidad: nuevaCantidad }]
    })

    return { agregadas, enCarrito: nuevaCantidad }
  }

  const actualizarCantidad = (id, cantidad) => {
    const nuevaCantidad = Math.max(1, Math.trunc(Number(cantidad) || 1))

    setItems((actuales) =>
      actuales.map((item) => {
        if (item.id !== id) return item

        const limite = item.stock > 0 ? item.stock : 1
        return { ...item, cantidad: Math.min(nuevaCantidad, limite) }
      }),
    )
  }

  const quitarProducto = (id) => {
    setItems((actuales) => actuales.filter((item) => item.id !== id))
  }

  const vaciarCarrito = () => {
    setItems([])
  }

  const totalUnidades = items.reduce((total, item) => total + item.cantidad, 0)
  const totalPrecio = items.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0,
  )
  const moneda = items[0]?.moneda || 'US$'

  const valor = {
    items,
    totalUnidades,
    totalPrecio,
    moneda,
    agregarProducto,
    actualizarCantidad,
    quitarProducto,
    vaciarCarrito,
  }

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}
