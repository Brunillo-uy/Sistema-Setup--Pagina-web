function ListaCaracteristicas({ caracteristicas = [], titulo = 'Características' }) {
  const lista = Array.isArray(caracteristicas) ? caracteristicas : []
  const items = lista
    .map((caracteristica) => caracteristica?.trim().replace(/^[-–—•]\s*/, ''))
    .filter(Boolean)

  if (items.length === 0) return null

  return (
    <section className="producto-caracteristicas" aria-labelledby="titulo-caracteristicas">
      <h2 id="titulo-caracteristicas">{titulo}</h2>
      <ul>
        {items.map((caracteristica, indice) => (
          <li key={`${caracteristica}-${indice}`}>{caracteristica}</li>
        ))}
      </ul>
    </section>
  )
}

export default ListaCaracteristicas
