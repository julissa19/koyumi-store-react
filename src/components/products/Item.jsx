import { useState } from "react";
import { Link } from "react-router-dom";

function Item({ producto }) {
  const [favorito, setFavorito] = useState(false);

  const { id, nombre, categoria, precio, imagen, descripcion, badge } = producto;

  function manejarFavorito() {
    setFavorito(!favorito);
  }

  return (
    <article className={favorito ? "product-card product-card--favorite" : "product-card"}>
      <div className="product-card__image">
        <img src={imagen} alt={nombre} />

        <span className="product-card__badge">
          {badge}
        </span>

        <button
          type="button"
          className={favorito ? "favorite-btn favorite-btn--active" : "favorite-btn"}
          onClick={manejarFavorito}
          aria-label={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
        >
          {favorito ? "♥" : "♡"}
        </button>
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