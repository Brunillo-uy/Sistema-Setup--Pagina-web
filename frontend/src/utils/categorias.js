// Nombres legibles para las categorías que vienen de MongoDB.
export const CATEGORIAS = {
  procesadores: 'Procesadores',
  'tarjetas-video': 'Tarjetas de video',
  'memorias-ram': 'Memorias RAM',
  motherboards: 'Motherboards',
  almacenamiento: 'Almacenamiento',
  fuentes: 'Fuentes de poder',
  gabinetes: 'Gabinetes',
  monitores: 'Monitores',
  perifericos: 'Periféricos',
  mouse: 'Mouse',
  accesorios: 'Accesorios',
  sillas: 'Sillas',
  escritorios: 'Escritorios',
}

// Orden en el que se muestran las categorías en el catálogo.
export const ORDEN_CATEGORIAS = [
  'procesadores',
  'tarjetas-video',
  'motherboards',
  'memorias-ram',
  'almacenamiento',
  'fuentes',
  'gabinetes',
  'monitores',
  'perifericos',
  'mouse',
  'accesorios',
  'sillas',
  'escritorios',
]

export function etiquetaCategoria(valor = '') {
  const etiqueta = CATEGORIAS[valor] || valor.replace(/-/g, ' ')
  return etiqueta.charAt(0).toUpperCase() + etiqueta.slice(1)
}
