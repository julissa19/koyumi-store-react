function AdminProductos() {
  return (
    <section className="admin-page">
      <div className="admin-hero">
        <span className="eyebrow">Panel Koyumi</span>

        <h2>Gestión de productos</h2>

        <p>
          Desde acá vamos a crear, editar y eliminar productos usando Firestore
          e ImgBB, respetando el flujo trabajado en clase.
        </p>
      </div>

      <div className="state-box">
        <span>🛠️</span>
        <p>
          Panel admin protegido listo. En el siguiente paso agregamos el CRUD real.
        </p>
      </div>
    </section>
  );
}

export default AdminProductos;