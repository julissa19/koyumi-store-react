function ProductAdminForm({
  formData,
  imagenPreview,
  editando,
  loading,
  error,
  success,
  onChange,
  onImageChange,
  onSubmit,
  onCancelEdit
}) {
  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form__top">
        <div>
          <span className="eyebrow">
            {editando ? "Editar producto" : "Nuevo producto"}
          </span>

          <h3>{editando ? "Actualizar producto" : "Crear producto Koyumi"}</h3>

          <p>
            Completá los datos del producto. La imagen se sube a ImgBB y la URL
            queda guardada en Firestore.
          </p>
        </div>

        {editando && (
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancelEdit}
            disabled={loading}
          >
            Cancelar edición
          </button>
        )}
      </div>

      <div className="form-grid">
        <label>
          Nombre *
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={onChange}
            placeholder="Ej: Paleta Cherry Cute"
            required
          />
        </label>

        <label>
          Categoría *
          <select
            name="categoria"
            value={formData.categoria}
            onChange={onChange}
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
          Precio *
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={onChange}
            placeholder="Ej: 15000"
            min="1"
            required
          />
        </label>

        <label>
          Stock *
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={onChange}
            placeholder="Ej: 8"
            min="0"
            required
          />
        </label>
      </div>

      <label>
        Badge
        <input
          type="text"
          name="badge"
          value={formData.badge}
          onChange={onChange}
          placeholder="Ej: Cute, Nuevo, Magic, Limited"
        />
      </label>

      <label>
        Descripción *
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
          placeholder="Descripción cute del producto..."
          rows="4"
          required
        />
      </label>

      <label>
        Imagen {editando ? "(opcional si querés cambiarla)" : "*"}
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
        />
      </label>

      {imagenPreview && (
        <div className="admin-image-preview">
          <img src={imagenPreview} alt="Vista previa del producto" />

          <div>
            <h4>Vista previa</h4>
            <p>
              Esta será la imagen visible en el catálogo y en el detalle del
              producto.
            </p>
          </div>
        </div>
      )}

      {error && <p className="auth-error">{error}</p>}
      {success && <p className="detail-success">{success}</p>}

      <button type="submit" className="btn btn--primary" disabled={loading}>
        {loading
          ? "Guardando..."
          : editando
            ? "Actualizar producto"
            : "Guardar producto"}
      </button>
    </form>
  );
}

export default ProductAdminForm;