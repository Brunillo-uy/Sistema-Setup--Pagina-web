function CategoriaCard(props) {
  return (
    <div className="categoria-elemento">
      <img src={props.Imagen} alt={props.Alt} id={props.IdImagen} />
      <h6>{props.Titulo}</h6>
    </div>
  )
}

export default CategoriaCard
