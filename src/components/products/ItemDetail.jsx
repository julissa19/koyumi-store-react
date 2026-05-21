import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function ItemDetail() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/data/productos.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudo cargar el detalle del producto");
        }

        return respuesta.json();
      })
      .then((data) => {
        const productoEncontrado = data.find(
          (item) => item.id === Number(id)
        );

        if (!productoEncontrado) {
          throw new Error("Producto no encontrado");
        }

        setProducto(productoEncontrado);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return (
      <section className="detail-page">
        <div className="state-box">
          <span>✨</span>
          <p>Cargando detalle...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="detail-page">
        <div className="state-box state-box--error">
          <span>💔</span>
          <p>{error}</p>
          <Link to="/productos" className="btn btn--primary">
            Volver al catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="detail-page">
      <div className="detail-card">
        <div className="detail-card__image">
          <img src={producto.imagen} alt={producto.nombre} />
        </div>

        <div className="detail-card__info">
          <span className="eyebrow">{producto.categoria}</span>

          <h2>{producto.nombre}</h2>

          <p>{producto.descripcion}</p>

          <div className="detail-meta">
            <div>
              <span>Precio</span>
              <strong>${producto.precio.toLocaleString("es-AR")}</strong>
            </div>

            <div>
              <span>Stock disponible</span>
              <strong>{producto.stock} unidades</strong>
            </div>
          </div>

          <div className="detail-actions">
            <button className="btn btn--primary">
              Agregar al carrito
            </button>

            <Link to="/productos" className="btn btn--ghost">
              Volver
            </Link>
          </div>

          <p className="detail-note">
             El botón queda preparado visualmente. La lógica
            real del carrito con Context API es para la próxima pre-entrega.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ItemDetail;