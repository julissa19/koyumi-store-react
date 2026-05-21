import { Link } from "react-router-dom";

function Item({ producto }) {
  const { id, nombre, categoria, precio, imagen, descripcion, badge } = producto;

  return (
    <article className="product-card">
      <div className="product-card__image">
        <img src={imagen} alt={nombre} />

        <span className="product-card__badge">
          {badge}
        </span>
      </div>

      <div className="product-card__content">
        <span className="product-card__category">
          {categoria}
        </span>

        <h3>{nombre}</h3>

        <p>{descripcion}</p>

        <div className="product-card__footer">
          <strong>${precio.toLocaleString("es-AR")}</strong>

          <Link to={`/producto/${id}`} className="btn btn--small">
            Ver detalle
          </Link>
        </div>
      </div>
    </article>
  );
}

export default Item;