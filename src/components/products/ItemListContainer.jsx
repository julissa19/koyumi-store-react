import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
import Item from "./Item";

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriaActiva = searchParams.get("categoria") || "Todos";

  useEffect(() => {
    async function cargarProductos() {
      setCargando(true);
      setError(null);

      try {
        const productosRef = collection(db, "productos");
        const snapshot = await getDocs(productosRef);

        const productosFirebase = snapshot.docs.map((documento) => ({
          id: documento.id,
          ...documento.data()
        }));

        productosFirebase.sort((a, b) =>
          a.nombre.localeCompare(b.nombre)
        );

        setProductos(productosFirebase);
      } catch (error) {
        console.error(error);
        setError("No se pudieron cargar los productos desde Firestore.");
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();
  }, []);

  const categorias = useMemo(() => {
    const categoriasUnicas = productos.map((producto) => producto.categoria);
    return ["Todos", ...new Set(categoriasUnicas)];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === "Todos") {
      return productos;
    }

    return productos.filter(
      (producto) => producto.categoria === categoriaActiva
    );
  }, [productos, categoriaActiva]);

  function cambiarCategoria(categoria) {
    if (categoria === "Todos") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria });
    }
  }

  if (cargando) {
    return (
      <div className="state-box">
        <span>✨</span>
        <p>Cargando productos Koyumi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-box state-box--error">
        <span>💔</span>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="catalog">
      <div className="catalog__header">
        <div>
          <span className="eyebrow">Selección importada</span>
          <h3>Catálogo Koyumi</h3>
        </div>

        <p>{productosFiltrados.length} productos disponibles</p>
      </div>

      <div className="filter-bar">
        {categorias.map((categoria) => (
          <button
            key={categoria}
            type="button"
            className={
              categoriaActiva === categoria
                ? "filter-btn filter-btn--active"
                : "filter-btn"
            }
            onClick={() => cambiarCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      {productosFiltrados.length === 0 ? (
        <div className="state-box">
          <span>🔎</span>
          <p>No encontramos productos en esta categoría.</p>
        </div>
      ) : (
        <div className="product-grid">
          {productosFiltrados.map((producto) => (
            <Item key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ItemListContainer;