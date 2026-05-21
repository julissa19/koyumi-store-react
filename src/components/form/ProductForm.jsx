function ProductForm({
  datosForm,
  imagenPreview,
  loading,
  enviado,
  manejarCambio,
  manejarCambioImagen,
  manejarEnvio
}) {
  return (
    <form className="new-product-form" onSubmit={manejarEnvio}>
      <div className="form-grid">
        <label>
          Nombre del producto
          <input
            type="text"
            name="nombre"
            value={datosForm.nombre}
            onChange={manejarCambio}
            placeholder="Ej: Paleta Cherry Cute"
            required
          />
        </label>

        <label>
          Categoría
          <select
            name="categoria"
            value={datosForm.categoria}
            onChange={manejarCambio}
            required
          >
            <option value="">Seleccionar categoría</option>
            <option value="Maquillaje">Maquillaje</option>
            <option value="Papelería">Papelería</option>
            <option value="Deco cute">Deco cute</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Coleccionables mágicos">Coleccionables mágicos</option>
          </select>
        </label>
      </div>

      <div className="form-grid">
        <label>
          Precio
          <input
            type="number"
            name="precio"
            value={datosForm.precio}
            onChange={manejarCambio}
            placeholder="Ej: 15000"
            min="1"
            required
          />
        </label>

        <label>
          Stock
          <input
            type="number"
            name="stock"
            value={datosForm.stock}
            onChange={manejarCambio}
            placeholder="Ej: 8"
            min="1"
            required
          />
        </label>
      </div>

      <label>
        Descripción
        <textarea
          name="descripcion"
          value={datosForm.descripcion}
          onChange={manejarCambio}
          placeholder="Contanos cómo es este producto cute..."
          rows="4"
          required
        />
      </label>

      <label>
        Imagen del producto
        <input
          type="file"
          accept="image/*"
          onChange={manejarCambioImagen}
          required
        />
      </label>

      {imagenPreview && (
        <div className="image-preview-box">
          <img src={imagenPreview} alt="Vista previa del producto" />

          <div>
            <h4>Vista previa de imagen</h4>
            <p>
              Esta imagen se muestra localmente para simular la carga del producto.
            </p>
          </div>
        </div>
      )}

      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading ? "Cargando producto..." : "Guardar producto"}
      </button>

      {enviado && (
        <p className="form-success">
          Producto cargado correctamente en modo simulación. Revisá la consola!
        </p>
      )}
    </form>
  );
}

export default ProductForm;