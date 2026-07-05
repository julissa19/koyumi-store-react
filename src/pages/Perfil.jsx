import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState("");

  useEffect(() => {
    async function cargarPedidos() {
      if (!user) return;

      setLoadingPedidos(true);
      setErrorPedidos("");

      try {
        const pedidosRef = collection(db, "pedidos");
        const consulta = query(
          pedidosRef,
          where("userId", "==", user.uid)
        );

        const snapshot = await getDocs(consulta);

        const pedidosFirebase = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data()
        }));

        pedidosFirebase.sort((a, b) =>
          new Date(b.creadoEn) - new Date(a.creadoEn)
        );

        setPedidos(pedidosFirebase);
      } catch (error) {
        console.error(error);
        setErrorPedidos("No se pudieron cargar tus pedidos.");
      } finally {
        setLoadingPedidos(false);
      }
    }

    cargarPedidos();
  }, [user]);

  async function manejarLogout() {
    await logout();
    navigate("/");
  }

  return (
    <section className="profile-page">
      <div className="profile-card">
        <span className="eyebrow">Mi perfil</span>

        <h2>Hola de nuevo ✨</h2>

        <p>
          Sesión iniciada como:
          <strong> {user.email}</strong>
        </p>

        <div className="profile-role">
          <span>Rol actual</span>
          <strong>{user.rol}</strong>
        </div>

        {user.rol === "admin" && (
          <p>
            Tenés permisos para acceder al Panel Koyumi y gestionar productos,
            cupones y herramientas internas.
          </p>
        )}

        <button type="button" className="btn btn--primary" onClick={manejarLogout}>
          Cerrar sesión
        </button>
      </div>

      <section className="orders-section">
        <div className="section-heading section-heading--admin">
          <span>Historial</span>
          <h2>Mis pedidos</h2>
          <p>
            Acá podés ver las compras que finalizaste desde el carrito.
          </p>
        </div>

        {loadingPedidos ? (
          <div className="state-box">
            <span>✨</span>
            <p>Cargando tus pedidos...</p>
          </div>
        ) : errorPedidos ? (
          <div className="state-box state-box--error">
            <span>💔</span>
            <p>{errorPedidos}</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="empty-orders">
            <span>🧺</span>
            <h3>Todavía no tenés pedidos</h3>
            <p>
              Cuando finalices una compra, tu pedido va a aparecer acá.
            </p>

            <Link to="/productos" className="btn btn--primary">
              Ver productos
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {pedidos.map((pedido) => (
              <article className="order-card" key={pedido.id}>
                <div className="order-card__header">
                  <div>
                    <span className="eyebrow">Pedido</span>
                    <h3>{pedido.id}</h3>
                  </div>

                  <strong className="order-status">
                    {pedido.estado || "pendiente"}
                  </strong>
                </div>

                <div className="order-card__meta">
                  <div>
                    <span>Fecha</span>
                    <strong>
                      {pedido.creadoEn
                        ? new Date(pedido.creadoEn).toLocaleDateString("es-AR")
                        : "Sin fecha"}
                    </strong>
                  </div>

                  <div>
                    <span>Productos</span>
                    <strong>{pedido.cantidadProductos}</strong>
                  </div>

                  <div>
                    <span>Total</span>
                    <strong>
                      ${Number(pedido.total).toLocaleString("es-AR")}
                    </strong>
                  </div>
                </div>

                {pedido.cupon && (
                  <div className="order-coupon">
                    Cupón aplicado: <strong>{pedido.cupon.codigo}</strong>{" "}
                    ({pedido.cupon.porcentaje}% OFF)
                  </div>
                )}

                <div className="order-products">
                  {pedido.productos?.map((producto) => (
                    <div className="order-product" key={producto.id}>
                      <img src={producto.imagen} alt={producto.nombre} />

                      <div>
                        <strong>{producto.nombre}</strong>
                        <span>
                          {producto.cantidad} x $
                          {Number(producto.precio).toLocaleString("es-AR")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

export default Perfil;