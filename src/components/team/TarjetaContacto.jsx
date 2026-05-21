function TarjetaContacto({ persona }) {
  return (
    <article className="team-card">
      <img src={persona.foto} alt={persona.nombre} />

      <div>
        <h4>{persona.nombre}</h4>
        <p>{persona.puesto}</p>
        <span>{persona.email}</span>
      </div>
    </article>
  );
}

export default TarjetaContacto;