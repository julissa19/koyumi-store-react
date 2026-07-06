import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useCart } from "../../context/CartContext";
import { Helmet } from "react-helmet";
import KoyumiLoader from "../ui/KoyumiLoader";

function ItemDetail() {
  const { id } = useParams();
  const { addToCart, isInCart } = useCart();

  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function cargarProducto() {
      setCargando(true);
      setError(null);
      setMensaje("");

      try {
        const productoRef = doc(db, "productos", id);
        const snapshot = await getDoc(productoRef);

        if (!snapshot.exists()) {
          throw new Error("Producto no encontrado");
        }

        setProducto({
          id: snapshot.id,
          ...snapshot.data()
        });

        setCantidad(1);
      } catch (error) {
        console.error(error);
        setError(error.message || "No se pudo cargar el detalle del producto");
      } finally {
        setCargando(false);
      }
    }

    cargarProducto();
  }, [id]);

  function incrementarCantidad() {
    if (!producto) return;

    if (cantidad < Number(producto.stock)) {
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
        <KoyumiLoader text="Cargando detalle..." />
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
  const precio = Number(producto.precio);
  const stock = Number(producto.stock);

  return (
    <section className="detail-page">
      <Helmet>
        <title>Koyumi | {producto.nombre}</title>
        <meta
          name="description"
          content={`Conocé ${producto.nombre}, producto de la categoría ${producto.categoria} en Koyumi.`}
        />
      </Helmet>
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
              <strong>${precio.toLocaleString("es-AR")}</strong>
            </div>

            <div>
              <span>Stock disponible</span>
              <strong>{stock} unidades</strong>
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
                ${(precio * cantidad).toLocaleString("es-AR")}
              </strong>
            </p>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={manejarAgregarAlCarrito}
              disabled={stock === 0}
              aria-label={`Agregar ${producto.nombre} al carrito`}
            >
              {stock === 0
                ? "Sin stock"
                : productoYaAgregado
                  ? "Sumar más unidades"
                  : "Agregar al carrito"}
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