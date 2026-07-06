import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "../firebase/config";
import KoyumiLoader from "../components/ui/KoyumiLoader";

function GestionCupones() {
  const [cupones, setCupones] = useState([]);
  const [formData, setFormData] = useState({
    codigo: "",
    porcentaje: ""
  });

  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function cargarCupones() {
    setLoading(true);
    setError("");

    try {
      const cuponesRef = collection(db, "cupones");
      const snapshot = await getDocs(cuponesRef);

      const cuponesFirebase = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
      }));

      cuponesFirebase.sort((a, b) => a.codigo.localeCompare(b.codigo));

      setCupones(cuponesFirebase);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los cupones.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargarCupones();
  }, []);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function validarFormulario() {
    const codigoNormalizado = formData.codigo.trim().toUpperCase();
    const porcentaje = Number(formData.porcentaje);

    if (!codigoNormalizado) {
      return "El código del cupón es obligatorio.";
    }

    if (porcentaje <= 0 || porcentaje > 100) {
      return "El porcentaje debe ser mayor a 0 y menor o igual a 100.";
    }

    return "";
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    setError("");
    setSuccess("");

    const errorValidacion = validarFormulario();

    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    setLoadingSave(true);

    try {
      const codigoNormalizado = formData.codigo.trim().toUpperCase();
      const porcentaje = Number(formData.porcentaje);

      const cuponesRef = collection(db, "cupones");
      const consultaDuplicado = query(
        cuponesRef,
        where("codigo", "==", codigoNormalizado)
      );

      const snapshotDuplicado = await getDocs(consultaDuplicado);

      if (!snapshotDuplicado.empty) {
        setError("Ya existe un cupón con ese código.");
        return;
      }

      await addDoc(cuponesRef, {
        codigo: codigoNormalizado,
        porcentaje,
        activo: true,
        creadoEn: new Date().toISOString()
      });

      setFormData({
        codigo: "",
        porcentaje: ""
      });

      setSuccess("Cupón creado correctamente ♡");

      await cargarCupones();
    } catch (error) {
      console.error(error);
      setError("No se pudo crear el cupón.");
    } finally {
      setLoadingSave(false);
    }
  }

  async function eliminarCupon(cupon) {
    const confirmar = window.confirm(
      `¿Querés eliminar el cupón ${cupon.codigo}?`
    );

    if (!confirmar) return;

    setError("");
    setSuccess("");

    try {
      await deleteDoc(doc(db, "cupones", cupon.id));
      setSuccess("Cupón eliminado correctamente.");
      await cargarCupones();
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar el cupón.");
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-hero">
        <span className="eyebrow">Panel Koyumi</span>

        <h2>Gestión de cupones</h2>

        <p>
          Creá y eliminá cupones de descuento para que luego puedan aplicarse en
          el carrito de compras.
        </p>
      </div>

      <div className="coupon-layout">
        <form className="coupon-form" onSubmit={manejarEnvio}>
          <div>
            <span className="eyebrow">Nuevo cupón</span>
            <h3>Crear descuento</h3>
          </div>

          <label>
            Código del cupón
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={manejarCambio}
              placeholder="Ej: KOYUMI10"
              required
            />
          </label>

          <label>
            Porcentaje de descuento
            <input
              type="number"
              name="porcentaje"
              value={formData.porcentaje}
              onChange={manejarCambio}
              placeholder="Ej: 10"
              min="1"
              max="100"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {success && <p className="detail-success">{success}</p>}

          <button type="submit" className="btn btn--primary" disabled={loadingSave}>
            {loadingSave ? "Guardando..." : "Crear cupón"}
          </button>
        </form>

        <div className="coupon-list-card">
          <div className="coupon-list-header">
            <span className="eyebrow">Cupones activos</span>
            <h3>Lista de descuentos</h3>
          </div>

          {loading ? (
            <KoyumiLoader text="Cargando cupones..." />
          ) : cupones.length === 0 ? (
            <div className="state-box">
              <img
                src="/images/icons/coupon.png"
                alt=""
                className="state-img"
              />
              <p>Todavía no hay cupones creados.</p>
            </div>
          ) : (
            <div className="coupon-list">
              {cupones.map((cupon) => (
                <article className="coupon-item" key={cupon.id}>
                  <div>
                    <strong>{cupon.codigo}</strong>
                    <span>{cupon.porcentaje}% OFF</span>
                  </div>

                  <button
                    type="button"
                    className="btn btn--danger"
                    onClick={() => eliminarCupon(cupon)}
                  >
                    Eliminar
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GestionCupones;