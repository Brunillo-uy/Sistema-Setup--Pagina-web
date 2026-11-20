export const MARCAS = {
  amd: 'AMD',
  nvidia: 'NVIDIA',
  intel: 'Intel',
  kingston: 'Kingston',
  corsair: 'Corsair',
  teamgroup: 'TeamGroup',
  asus: 'ASUS',
  msi: 'MSI',
  gigabyte: 'Gigabyte',
  samsung: 'Samsung',
  seagate: 'Seagate',
  'western digital': 'Western Digital',
  evga: 'EVGA',
  gamemax: 'Gamemax',
  lg: 'LG',
  aoc: 'AOC',
  xiaomi: 'Xiaomi',
  redragon: 'Redragon',
  logitech: 'Logitech',
  hyperx: 'HyperX',
}

export function etiquetaMarca(valor = '') {
  const clave = valor.toLowerCase()
  if (MARCAS[clave]) return MARCAS[clave]

  return valor
    .split(' ')
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ')
}
