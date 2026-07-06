import { useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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

  const { user } = useAuth();

  const [codigoCupon, setCodigoCupon] = useState("");
  const [cuponAplicado, setCuponAplicado] = useState(null);
  const [loadingCupon, setLoadingCupon] = useState(false);
  const [errorCupon, setErrorCupon] = useState("");

  const [loadingPedido, setLoadingPedido] = useState(false);
  const [errorPedido, setErrorPedido] = useState("");
  const [pedidoCreado, setPedidoCreado] = useState(null);

  const totalItems = getCartQuantity();
  const subtotal = getCartTotal();

  const descuento = cuponAplicado
    ? Math.round((subtotal * Number(cuponAplicado.porcentaje)) / 100)
    : 0;

  const totalFinal = subtotal - descuento;

  async function aplicarCupon(evento) {
    evento.preventDefault();

    setErrorCupon("");
    setCuponAplicado(null);

    const codigoNormalizado = codigoCupon.trim().toUpperCase();

    if (!codigoNormalizado) {
      setErrorCupon("Ingresá un código de cupón.");
      return;
    }

    setLoadingCupon(true);

    try {
      const cuponesRef = collection(db, "cupones");
      const consulta = query(
        cuponesRef,
        where("codigo", "==", codigoNormalizado),
        where("activo", "==", true)
      );

      const snapshot = await getDocs(consulta);

      if (snapshot.empty) {
        setErrorCupon("El cupón no existe o no está activo.");
        return;
      }

      const cuponDoc = snapshot.docs[0];

      setCuponAplicado({
        id: cuponDoc.id,
        ...cuponDoc.data()
      });
    } catch (error) {
      console.error(error);
      setErrorCupon("No se pudo validar el cupón.");
    } finally {
      setLoadingCupon(false);
    }
  }

  function quitarCupon() {
    setCodigoCupon("");
    setCuponAplicado(null);
    setErrorCupon("");
  }

  function vaciarCarritoCompleto() {
    clearCart();
    quitarCupon();
    setPedidoCreado(null);
    setErrorPedido("");
  }

  async function finalizarCompra() {
    setErrorPedido("");
    setPedidoCreado(null);

    if (!user) {
      setErrorPedido("Para finalizar la compra tenés que iniciar sesión.");
      return;
    }

    if (cart.length === 0) {
      setErrorPedido("El carrito está vacío.");
      return;
    }

    setLoadingPedido(true);

    try {
      const pedidoPayload = {
        userId: user.uid,
        userEmail: user.email,
        productos: cart.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          categoria: item.categoria,
          precio: Number(item.precio),
          cantidad: Number(item.cantidad),
          imagen: item.imagen,
          subtotal: Number(item.precio) * Number(item.cantidad)
        })),
        cantidadProductos: totalItems,
        subtotal,
        cupon: cuponAplicado
          ? {
              id: cuponAplicado.id,
              codigo: cuponAplicado.codigo,
              porcentaje: Number(cuponAplicado.porcentaje)
            }
          : null,
        descuento,
        total: totalFinal,
        estado: "pendiente",
        creadoEn: new Date().toISOString()
      };

      const pedidoRef = await addDoc(collection(db, "pedidos"), pedidoPayload);

      setPedidoCreado({
        id: pedidoRef.id,
        total: totalFinal
      });

      clearCart();
      quitarCupon();
    } catch (error) {
      console.error(error);
      setErrorPedido("No se pudo finalizar la compra. Intentá nuevamente.");
    } finally {
      setLoadingPedido(false);
    }
  }

  if (pedidoCreado) {
    return (
      <section className="cart-page">
        <div className="order-success-card">
          <img
            src="/images/icons/sparkle.png"
            alt=""
            className="order-success-card__icon"
          />

          <span className="eyebrow">Pedido creado</span>

          <h2>¡Compra registrada!</h2>

          <p>
            Tu pedido fue guardado correctamente en Firestore. El total final fue:
          </p>

          <strong>${Number(pedidoCreado.total).toLocaleString("es-AR")}</strong>

          <div className="order-code">
            <span>ID del pedido</span>
            <code>{pedidoCreado.id}</code>
          </div>

          <div className="order-success-actions">
            <Link to="/productos" className="btn btn--primary">
              Seguir comprando
            </Link>

            <Link to="/perfil" className="btn btn--ghost">
              Ir a mi perfil
            </Link>
          </div>
        </div>
      </section>
    );
  }

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
            eliminar productos, aplicar cupones o vaciar la compra.
          </p>
        </div>

        <button type="button" className="btn btn--ghost" onClick={vaciarCarritoCompleto}>
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
                <p>${Number(item.precio).toLocaleString("es-AR")} c/u</p>

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
                ${(Number(item.precio) * item.cantidad).toLocaleString("es-AR")}
              </strong>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <span className="eyebrow">Resumen</span>

          <h3>Total de compra</h3>

          <form className="coupon-apply-form" onSubmit={aplicarCupon}>
            <label>
              Código de descuento
              <div>
                <input
                  type="text"
                  value={codigoCupon}
                  onChange={(evento) => setCodigoCupon(evento.target.value)}
                  placeholder="Ej: KOYUMI10"
                />

                <button type="submit" className="btn btn--small" disabled={loadingCupon}>
                  {loadingCupon ? "..." : "Aplicar"}
                </button>
              </div>
            </label>
          </form>

          {errorCupon && <p className="coupon-error">{errorCupon}</p>}

          {cuponAplicado && (
            <div className="coupon-applied">
              <span>
                Cupón aplicado: <strong>{cuponAplicado.codigo}</strong>
              </span>

              <button type="button" onClick={quitarCupon}>
                Quitar
              </button>
            </div>
          )}

          <div className="summary-row">
            <span>Productos</span>
            <strong>{totalItems}</strong>
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>${subtotal.toLocaleString("es-AR")}</strong>
          </div>

          {cuponAplicado && (
            <div className="summary-row summary-row--discount">
              <span>Descuento {cuponAplicado.porcentaje}%</span>
              <strong>-${descuento.toLocaleString("es-AR")}</strong>
            </div>
          )}

          <div className="summary-row summary-row--total">
            <span>Total final</span>
            <strong>${totalFinal.toLocaleString("es-AR")}</strong>
          </div>

          {errorPedido ? (
            <p className="coupon-error">{errorPedido}</p>
          ) : (
            !user && (
              <p className="cart-login-hint">
                Para finalizar la compra, iniciá sesión o creá una cuenta.
              </p>
            )
          )}

          <button
            type="button"
            className="btn btn--primary"
            onClick={finalizarCompra}
            disabled={loadingPedido}
          >
            {loadingPedido ? "Guardando pedido..." : "Finalizar compra"}
          </button>

          {!user && (
            <Link to="/login" className="btn btn--ghost">
              Iniciar sesión
            </Link>
          )}

          <Link to="/productos" className="btn btn--ghost">
            Seguir comprando
          </Link>
        </aside>
      </div>
    </section>
  );
}

export default Carrito;