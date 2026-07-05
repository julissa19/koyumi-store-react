import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Carrito() {
  const {
    cart,
    removeItem,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
    getCartQuantity
  } = useCart();

  const totalItems = getCartQuantity();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <section className="cart-page">
        <div className="empty-cart">
          <img src="/images/icons/cart.png" alt="" className="empty-cart__icon" />

          <h2>Tu carrito está vacío</h2>

          <p>
            Todavía no agregaste productos. Explorá el catálogo de Koyumi y sumá
            tus importados cute favoritos.
          </p>

          <Link to="/productos" className="btn btn--primary">
            Ver productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-header">
        <div>
          <span className="eyebrow">Carrito Koyumi</span>
          <h2>Tu selección cute</h2>
          <p>
            Tenés {totalItems} producto/s en el carrito. Podés ajustar cantidades,
            eliminar productos o vaciar la compra.
          </p>
        </div>

        <button type="button" className="btn btn--ghost" onClick={clearCart}>
          Vaciar carrito
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-list">
          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.imagen} alt={item.nombre} />

              <div className="cart-item__content">
                <span>{item.categoria}</span>
                <h3>{item.nombre}</h3>
                <p>${item.precio.toLocaleString("es-AR")} c/u</p>

                <div className="cart-item__actions">
                  <div className="quantity-control quantity-control--cart">
                    <button
                      type="button"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      -
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      type="button"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <strong className="cart-item__subtotal">
                ${(item.precio * item.cantidad).toLocaleString("es-AR")}
              </strong>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <span className="eyebrow">Resumen</span>

          <h3>Total de compra</h3>

          <div className="summary-row">
            <span>Productos</span>
            <strong>{totalItems}</strong>
          </div>

          <div className="summary-row">
            <span>Total</span>
            <strong>${total.toLocaleString("es-AR")}</strong>
          </div>

          <button type="button" className="btn btn--primary">
            Finalizar compra
          </button>

          <Link to="/productos" className="btn btn--ghost">
            Seguir comprando
          </Link>

          <p>
            La compra real y el checkout se integrarán en una próxima etapa.
          </p>
        </aside>
      </div>
    </section>
  );
}

export default Carrito;