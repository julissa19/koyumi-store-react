import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase/config";
import { uploadImageToImgBB } from "../services/imgbb";
import ProductAdminForm from "../components/admin/ProductAdminForm";
import ProductAdminList from "../components/admin/ProductAdminList";
import ConfirmModal from "../components/admin/ConfirmModal";

const initialFormData = {
  nombre: "",
  categoria: "",
  precio: "",
  stock: "",
  badge: "Cute",
  descripcion: ""
};

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [productoAEditar, setProductoAEditar] = useState(null);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [loadingList, setLoadingList] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const editando = Boolean(productoAEditar);

  const resumen = useMemo(() => {
    const stockTotal = productos.reduce(
      (total, producto) => total + Number(producto.stock || 0),
      0
    );

    const categorias = new Set(productos.map((producto) => producto.categoria));

    return {
      totalProductos: productos.length,
      totalCategorias: categorias.size,
      stockTotal
    };
  }, [productos]);

  async function cargarProductos() {
    setLoadingList(true);

    try {
      const productosRef = collection(db, "productos");
      const snapshot = await getDocs(productosRef);

      const productosFirebase = snapshot.docs.map((documento) => ({
        id: documento.id,
        ...documento.data()
      }));

      productosFirebase.sort((a, b) => a.nombre.localeCompare(b.nombre));

      setProductos(productosFirebase);
    } catch (error) {
      console.error(error);
      setError("No se pudieron cargar los productos desde Firestore.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    cargarProductos();
  }, []);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormData({
      ...formData,
      [name]: value
    });
  }

  function manejarCambioImagen(evento) {
    const archivo = evento.target.files[0];

    if (!archivo) {
      setImagenFile(null);
      setImagenPreview(productoAEditar?.imagen || "");
      return;
    }

    setImagenFile(archivo);
    setImagenPreview(URL.createObjectURL(archivo));
  }

  function validarFormulario() {
    if (!formData.nombre.trim()) {
      return "El nombre del producto es obligatorio.";
    }

    if (!formData.categoria) {
      return "La categoría es obligatoria.";
    }

    if (Number(formData.precio) <= 0) {
      return "El precio debe ser mayor a 0.";
    }

    if (Number(formData.stock) < 0) {
      return "El stock no puede ser negativo.";
    }

    if (!formData.descripcion.trim()) {
      return "La descripción es obligatoria.";
    }

    if (!editando && !imagenFile) {
      return "Tenés que seleccionar una imagen para crear el producto.";
    }

    return "";
  }

  function limpiarFormulario() {
    setFormData(initialFormData);
    setImagenFile(null);
    setImagenPreview("");
    setProductoAEditar(null);
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
      let imagenUrl = productoAEditar?.imagen || "";

      if (imagenFile) {
        imagenUrl = await uploadImageToImgBB(imagenFile);
      }

      const productoPayload = {
        nombre: formData.nombre.trim(),
        categoria: formData.categoria,
        precio: Number(formData.precio),
        stock: Number(formData.stock),
        badge: formData.badge.trim() || "Cute",
        descripcion: formData.descripcion.trim(),
        imagen: imagenUrl,
        actualizadoEn: new Date().toISOString()
      };

      if (editando) {
        const productoRef = doc(db, "productos", productoAEditar.id);
        await updateDoc(productoRef, productoPayload);

        setSuccess("Producto actualizado correctamente ♡");
      } else {
        await addDoc(collection(db, "productos"), {
          ...productoPayload,
          creadoEn: new Date().toISOString()
        });

        setSuccess("Producto creado correctamente ♡");
      }

      limpiarFormulario();
      await cargarProductos();
    } catch (error) {
      console.error(error);
      setError(error.message || "No se pudo guardar el producto.");
    } finally {
      setLoadingSave(false);
    }
  }

  function manejarEditar(producto) {
    setProductoAEditar(producto);
    setFormData({
      nombre: producto.nombre || "",
      categoria: producto.categoria || "",
      precio: producto.precio || "",
      stock: producto.stock || "",
      badge: producto.badge || "Cute",
      descripcion: producto.descripcion || ""
    });
    setImagenFile(null);
    setImagenPreview(producto.imagen || "");
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  async function confirmarEliminar() {
    if (!productoAEliminar) return;

    setLoadingDelete(true);

    try {
      await deleteDoc(doc(db, "productos", productoAEliminar.id));
      setProductoAEliminar(null);
      await cargarProductos();
    } catch (error) {
      console.error(error);
      setError("No se pudo eliminar el producto.");
    } finally {
      setLoadingDelete(false);
    }
  }

  return (
    <section className="admin-page">
      <div className="admin-hero">
        <span className="eyebrow">Panel Koyumi</span>

        <h2>Gestión de productos</h2>

        <p>
          Creá, editá y eliminá productos del catálogo.
        </p>
      </div>

      <div className="admin-stats">
        <div>
          <span>Productos</span>
          <strong>{resumen.totalProductos}</strong>
        </div>

        <div>
          <span>Categorías</span>
          <strong>{resumen.totalCategorias}</strong>
        </div>

        <div>
          <span>Stock total</span>
          <strong>{resumen.stockTotal}</strong>
        </div>
      </div>

      <ProductAdminForm
        formData={formData}
        imagenPreview={imagenPreview}
        editando={editando}
        loading={loadingSave}
        error={error}
        success={success}
        onChange={manejarCambio}
        onImageChange={manejarCambioImagen}
        onSubmit={manejarEnvio}
        onCancelEdit={limpiarFormulario}
      />

      <section className="admin-products-section">
        <div className="section-heading section-heading--admin">
          <span>Catálogo admin</span>
          <h2>Productos cargados</h2>
        </div>

        <ProductAdminList
          productos={productos}
          loading={loadingList}
          onEdit={manejarEditar}
          onAskDelete={setProductoAEliminar}
        />
      </section>

      <ConfirmModal
        producto={productoAEliminar}
        onCancel={() => setProductoAEliminar(null)}
        onConfirm={confirmarEliminar}
        loading={loadingDelete}
      />
    </section>
  );
}

export default AdminProductos;