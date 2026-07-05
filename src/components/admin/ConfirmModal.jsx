function ConfirmModal({ producto, onCancel, onConfirm, loading }) {
  if (!producto) return null;

  return (
    <div className="modal-backdrop">
      <div className="confirm-modal">
        <span className="modal-icon">💔</span>

        <h3>¿Eliminar producto?</h3>

        <p>
          Estás por eliminar <strong>{producto.nombre}</strong>. Esta acción no se
          puede deshacer.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="btn btn--danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;