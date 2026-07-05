function ProductAdminList({ productos, loading, onEdit, onAskDelete }) {
  if (loading) {
    return (
      <div className="state-box">
        <span>✨</span>
        <p>Cargando productos del panel...</p>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="state-box">
        <img src="/images/icons/cart.png" alt="" className="cart-widget__icon" />
        <p>Todavía no hay productos cargados en Firestore.</p>
      </div>
    );
  }

  return (
    <div className="admin-list">
      {productos.map((producto) => (
        <article className="admin-product-card" key={producto.id}>
          <img src={producto.imagen} alt={producto.nombre} />

          <div className="admin-product-card__content">
            <span>{producto.categoria}</span>
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>

            <div className="admin-product-meta">
              <strong>${Number(producto.precio).toLocaleString("es-AR")}</strong>
              <strong>{producto.stock} unidades</strong>
            </div>
          </div>

          <div className="admin-product-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => onEdit(producto)}
            >
              Editar
            </button>

            <button
              type="button"
              className="btn btn--danger"
              onClick={() => onAskDelete(producto)}
            >
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ProductAdminList;