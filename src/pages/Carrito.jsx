import { Link } from "react-router-dom";

function Carrito() {
  return (
    <section className="cart-page">
      <div className="empty-cart">
        <img src="/images/icons/cart.png" alt="" className="empty-cart__icon" />

        <h2>Carrito listo para la próxima pre entrega</h2>

        <p>
          Para esta pre-entrega dejó preparada la vista del carrito. La
          funcionalidad completa con Context API se incorporará en la siguiente
          etapa del proyecto final.
        </p>

        <Link to="/productos" className="btn btn--primary">
          Ver productos
        </Link>
      </div>
    </section>
  );
}

export default Carrito;