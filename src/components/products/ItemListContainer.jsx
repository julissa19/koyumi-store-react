import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Item from "./Item";

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriaActiva = searchParams.get("categoria") || "Todos";

  useEffect(() => {
    fetch("/data/productos.json")
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error("No se pudieron cargar los productos");
        }

        return respuesta.json();
      })
      .then((data) => {
        setProductos(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const categorias = useMemo(() => {
    const categoriasUnicas = productos.map((producto) => producto.categoria);
    return ["Todos", ...new Set(categoriasUnicas)];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === "Todos") {
      return productos;
    }

    return productos.filter((producto) => producto.categoria === categoriaActiva);
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
        <img
          src="/images/icons/loading.png"
          alt=""
          className="state-img"
        />
        <p>Cargando productos Koyumi...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-box state-box--error">
        <img
          src="/images/icons/error.png"
          alt=""
          className="state-img"
        />
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

      <div className="product-grid">
        {productosFiltrados.map((producto) => (
          <Item key={producto.id} producto={producto} />
        ))}
      </div>
    </section>
  );
}

export default ItemListContainer;