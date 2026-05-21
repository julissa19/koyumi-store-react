import { useState } from "react";
import ProductForm from "./ProductForm";

const initialForm = {
  nombre: "",
  categoria: "",
  precio: "",
  stock: "",
  descripcion: ""
};

function NewProductContainer() {
  const [abierto, setAbierto] = useState(false);
  const [datosForm, setDatosForm] = useState(initialForm);
  const [imagenFile, setImagenFile] = useState(null);
  const [imagenPreview, setImagenPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setDatosForm({
      ...datosForm,
      [name]: value
    });
  }

  function manejarCambioImagen(evento) {
    const archivo = evento.target.files[0];

    if (!archivo) {
      setImagenFile(null);
      setImagenPreview("");
      return;
    }

    setImagenFile(archivo);
    setImagenPreview(URL.createObjectURL(archivo));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    if (!imagenFile) {
      alert("Por favor, seleccioná una imagen para el producto.");
      return;
    }

    setLoading(true);
    setEnviado(false);

    setTimeout(() => {
      const productoSimulado = {
        ...datosForm,
        precio: Number(datosForm.precio),
        stock: Number(datosForm.stock),
        imagenNombre: imagenFile.name,
        imagenPreview,
        creadoEn: new Date().toLocaleString("es-AR")
      };

      console.log("Producto cargado en modo simulación:", productoSimulado);

      setDatosForm(initialForm);
      setImagenFile(null);
      setImagenPreview("");
      setLoading(false);
      setEnviado(true);
    }, 1000);
  }

  return (
    <section className="new-product-section">
      <div className="new-product-header">
        <div>
          <span className="eyebrow">+ Producto</span>
          <h2>Cargar producto nuevo</h2>
          <p>
            Simulación de carga de un producto Koyumi seleccionando una imagen y
            completando sus datos. No modifica el catálogo publicado.
          </p>
        </div>

        <button
          type="button"
          className="btn btn--primary new-product-toggle"
          onClick={() => setAbierto(!abierto)}
        >
          {abierto ? "Cerrar formulario" : "+ Agregar producto"}
        </button>
      </div>

      {abierto && (
        <ProductForm
          datosForm={datosForm}
          imagenPreview={imagenPreview}
          loading={loading}
          enviado={enviado}
          manejarCambio={manejarCambio}
          manejarCambioImagen={manejarCambioImagen}
          manejarEnvio={manejarEnvio}
        />
      )}
    </section>
  );
}

export default NewProductContainer;