import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ItemDetail() {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");

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
        setCantidad(1);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  function incrementarCantidad() {
    if (!producto) return;

    if (cantidad < producto.stock) {
      setCantidad(cantidad + 1);
    }
  }

  function decrementarCantidad() {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  }

  function manejarAgregarAlCarrito() {
    addToCart(producto, cantidad);
    setMensaje(`${cantidad} unidad/es de ${producto.nombre} agregada/s al carrito.`);
  }

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

  const productoYaAgregado = isInCart(producto.id);

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

          <div className="detail-buy-box">
            <div className="quantity-control">
              <button type="button" onClick={decrementarCantidad}>
                -
              </button>

              <span>{cantidad}</span>

              <button type="button" onClick={incrementarCantidad}>
                +
              </button>
            </div>

            <p>
              Subtotal:{" "}
              <strong>
                ${(producto.precio * cantidad).toLocaleString("es-AR")}
              </strong>
            </p>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={manejarAgregarAlCarrito}
            >
              {productoYaAgregado ? "Sumar más unidades" : "Agregar al carrito"}
            </button>

            <Link to="/productos" className="btn btn--ghost">
              Volver
            </Link>
          </div>

          {mensaje && (
            <p className="detail-success">
              {mensaje}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ItemDetail;