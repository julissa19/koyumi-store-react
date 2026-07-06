import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { db } from "../../firebase/config";
import Item from "./Item";

const PRODUCTOS_POR_PAGINA = 8;

const SearchBox = styled.div`
  width: 100%;
  margin: 22px 0 18px;
  background:
    linear-gradient(135deg, rgba(255, 234, 242, 0.92), rgba(255, 255, 255, 0.96)),
    radial-gradient(circle at right top, rgba(191, 216, 184, 0.34), transparent 34%);
  border: 1px solid var(--border);
  border-radius: 28px;
  padding: 18px;
  box-shadow: var(--shadow-soft);
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: var(--primary-strong);
    flex-shrink: 0;
  }

  input {
    width: 100%;
    border: 0;
    outline: none;
    background: transparent;
    color: var(--text);
    font-weight: 800;
    font-size: 15px;
  }

  input::placeholder {
    color: var(--muted);
  }
`;

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
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

  useEffect(() => {
    setPaginaActual(1);
  }, [categoriaActiva, terminoBusqueda]);

  const categorias = useMemo(() => {
    const categoriasUnicas = productos.map((producto) => producto.categoria);
    return ["Todos", ...new Set(categoriasUnicas)];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const busquedaNormalizada = terminoBusqueda.trim().toLowerCase();

    return productos.filter((producto) => {
      const coincideCategoria =
        categoriaActiva === "Todos" || producto.categoria === categoriaActiva;

      const coincideBusqueda = producto.nombre
        ?.toLowerCase()
        .includes(busquedaNormalizada);

      return coincideCategoria && coincideBusqueda;
    });
  }, [productos, categoriaActiva, terminoBusqueda]);

  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA) || 1;

  const productosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
    const fin = inicio + PRODUCTOS_POR_PAGINA;

    return productosFiltrados.slice(inicio, fin);
  }, [productosFiltrados, paginaActual]);

  function cambiarCategoria(categoria) {
    if (categoria === "Todos") {
      setSearchParams({});
    } else {
      setSearchParams({ categoria });
    }
  }

  function irPaginaAnterior() {
    setPaginaActual((pagina) => Math.max(pagina - 1, 1));
  }

  function irPaginaSiguiente() {
    setPaginaActual((pagina) => Math.min(pagina + 1, totalPaginas));
  }

  if (cargando) {
    return (
      <section className="catalog">
        <Helmet>
          <title>Koyumi | Cargando productos</title>
          <meta
            name="description"
            content="Catálogo de productos cute importados de Koyumi."
          />
        </Helmet>

        <div className="state-box">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando productos...</span>
          </Spinner>
          <p>Cargando productos Koyumi...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="catalog">
        <Helmet>
          <title>Koyumi | Error al cargar productos</title>
          <meta
            name="description"
            content="No se pudieron cargar los productos de Koyumi."
          />
        </Helmet>

        <div className="state-box state-box--error">
          <span>💔</span>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="catalog">
      <Helmet>
        <title>Koyumi | Productos cute importados</title>
        <meta
          name="description"
          content="Explorá el catálogo Koyumi con maquillaje, papelería, accesorios, deco cute y coleccionables mágicos."
        />
      </Helmet>

      <div className="catalog__header">
        <div>
          <span className="eyebrow">Selección importada</span>
          <h3>Catálogo Koyumi</h3>
        </div>

        <p>{productosFiltrados.length} productos encontrados</p>
      </div>

      <SearchBox>
        <FaSearch aria-hidden="true" />

        <input
          type="text"
          value={terminoBusqueda}
          onChange={(evento) => setTerminoBusqueda(evento.target.value)}
          placeholder="Buscar productos por nombre..."
          aria-label="Buscar productos por nombre"
        />
      </SearchBox>

      <div className="filter-bar" aria-label="Filtros de categorías">
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
          <FaSearch className="state-react-icon" aria-hidden="true" />
          <p>No encontramos productos con esa búsqueda.</p>
        </div>
      ) : (
        <>
          <Container fluid className="catalog-bootstrap-grid px-0">
            <Row className="g-4">
              {productosPaginados.map((producto) => (
                <Col key={producto.id} xs={12} sm={6} lg={4} xl={3}>
                  <Item producto={producto} />
                </Col>
              ))}
            </Row>
          </Container>

          {totalPaginas > 1 && (
            <div className="pagination-koyumi" aria-label="Paginación de productos">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={irPaginaAnterior}
                disabled={paginaActual === 1}
                aria-label="Ir a la página anterior"
              >
                Anterior
              </button>

              <span>
                Página <strong>{paginaActual}</strong> de{" "}
                <strong>{totalPaginas}</strong>
              </span>

              <button
                type="button"
                className="btn btn--ghost"
                onClick={irPaginaSiguiente}
                disabled={paginaActual === totalPaginas}
                aria-label="Ir a la página siguiente"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ItemListContainer;