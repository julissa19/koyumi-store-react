import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase/config";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingEstado, setLoadingEstado] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function cargarPedidos() {
    setLoading(true);
    setError("");

    try {
      const pedidosRef = collection(db, "pedidos");
      const snapshot = await getDocs(pedidosRef);

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
      setError("No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarPedidos();
  }, []);

  const resumen = useMemo(() => {
    const totalPedidos = pedidos.length;

    const totalVendido = pedidos.reduce(
      (total, pedido) => total + Number(pedido.total || 0),
      0
    );

    const pendientes = pedidos.filter(
      (pedido) => pedido.estado === "pendiente"
    ).length;

    return {
      totalPedidos,
      totalVendido,
      pendientes
    };
  }, [pedidos]);

  async function cambiarEstado(pedidoId, nuevoEstado) {
    setLoadingEstado(pedidoId);
    setError("");
    setSuccess("");

    try {
      const pedidoRef = doc(db, "pedidos", pedidoId);

      await updateDoc(pedidoRef, {
        estado: nuevoEstado,
        actualizadoEn: new Date().toISOString()
      });

      setSuccess("Estado del pedido actualizado correctamente ♡");

      setPedidos((pedidosActuales) =>
        pedidosActuales.map((pedido) =>
          pedido.id === pedidoId
            ? { ...pedido, estado: nuevoEstado }
            : pedido
        )
      );
    } catch (error) {
      console.error(error);
      setError("No se pudo actualizar el estado del pedido.");
    } finally {
      setLoadingEstado("");
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-hero">
        <span className="eyebrow">Panel Koyumi</span>

        <h2>Gestión de pedidos</h2>

        <p>
          Revisá las compras realizadas, los productos incluidos, el cupón
          aplicado y el estado actual de cada pedido.
        </p>
      </div>

      <div className="admin-orders-stats">
        <div>
          <span>Pedidos</span>
          <strong>{resumen.totalPedidos}</strong>
        </div>

        <div>
          <span>Pendientes</span>
          <strong>{resumen.pendientes}</strong>
        </div>

        <div>
          <span>Total vendido</span>
          <strong>${resumen.totalVendido.toLocaleString("es-AR")}</strong>
        </div>
      </div>

      {error && <p className="auth-error admin-message">{error}</p>}
      {success && <p className="detail-success admin-message">{success}</p>}

      {loading ? (
        <div className="state-box">
            <img
              src="/images/icons/loading.png"
              alt=""
              className="state-img"
            />
            <p>Cargando tus pedidos...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="state-box">
          <img
            src="/images/icons/empty-basket.png"
            alt=""
            className="empty-orders__icon"
            />
          <p>Todavía no hay pedidos registrados.</p>
        </div>
        
      ) : (
        <div className="admin-orders-list">
          {pedidos.map((pedido) => (
            <article className="admin-order-card" key={pedido.id}>
              <div className="admin-order-card__header">
                <div>
                  <span className="eyebrow">Pedido</span>
                  <h3>{pedido.id}</h3>
                  <p>{pedido.userEmail}</p>
                </div>

                <div className="admin-order-status">
                  <label>
                    Estado
                    <select
                      value={pedido.estado || "pendiente"}
                      onChange={(evento) =>
                        cambiarEstado(pedido.id, evento.target.value)
                      }
                      disabled={loadingEstado === pedido.id}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="preparando">Preparando</option>
                      <option value="enviado">Enviado</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="admin-order-meta">
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
                  <span>Subtotal</span>
                  <strong>${Number(pedido.subtotal).toLocaleString("es-AR")}</strong>
                </div>

                <div>
                  <span>Descuento</span>
                  <strong>-${Number(pedido.descuento || 0).toLocaleString("es-AR")}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>${Number(pedido.total).toLocaleString("es-AR")}</strong>
                </div>
              </div>

              {pedido.cupon && (
                <div className="admin-order-coupon">
                  Cupón aplicado: <strong>{pedido.cupon.codigo}</strong>{" "}
                  ({pedido.cupon.porcentaje}% OFF)
                </div>
              )}

              <div className="admin-order-products">
                {pedido.productos?.map((producto) => (
                  <div className="admin-order-product" key={producto.id}>
                    <img src={producto.imagen} alt={producto.nombre} />

                    <div>
                      <strong>{producto.nombre}</strong>
                      <span>
                        {producto.cantidad} x $
                        {Number(producto.precio).toLocaleString("es-AR")}
                      </span>
                    </div>

                    <b>
                      ${Number(producto.subtotal).toLocaleString("es-AR")}
                    </b>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminPedidos;