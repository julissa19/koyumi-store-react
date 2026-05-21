import { Link } from "react-router-dom";

function Inicio() {
  return (
    <section className="home">
      <div className="hero">
        <div className="hero__content">
          <span className="eyebrow">
            <img src="/images/icons/sparkle.png" alt="" className="eyebrow-icon" />
            Nueva colección importada
          </span>

          <h2>Cositas cute para hacer tu mundo más mágico</h2>

          <p>
            En Koyumi encontrás maquillaje, papelería, accesorios, deco y
            coleccionables mágicos con una estética modern kawaii, coquette y dreamy.
          </p>

          <div className="hero__actions">
            <Link to="/productos" className="btn btn--primary">
              Ver productos
            </Link>

            <a href="#categorias" className="btn btn--ghost">
              Explorar categorías
            </a>
          </div>
        </div>

        <div className="hero__visual">
          <div className="floating-card floating-card--one">
            <img src="/images/icons/bow.png" alt="" className="floating-icon" />
            <p>Accesorios coquette</p>
          </div>

          <div className="hero__circle">
            <img src="/images/icons/strawberry.png" alt="" className="hero__main-icon" />
            <h3>Koyumi Picks</h3>
            <p>Maquillaje · Deco · Papelería</p>
          </div>

          <div className="floating-card floating-card--two">
            <img src="/images/icons/frog.png" alt="" className="floating-icon" />
            <p>Deco matcha</p>
          </div>
        </div>
      </div>

      <section className="categories" id="categorias">
        <div className="section-heading">
          <span>Elegí tu vibe</span>
          <h2>Categorías destacadas</h2>
        </div>

        <div className="category-grid">
          <Link to="/productos?categoria=Maquillaje" className="category-card">
            <div className="category-icon">
              <img src="/images/icons/lipstick.png" alt="" />
            </div>
            <h3>Maquillaje</h3>
            <p>Gloss, paletas y productos con estética kawaii.</p>
          </Link>

          <Link to="/productos?categoria=Papelería" className="category-card">
            <div className="category-icon">
              <img src="/images/icons/notebook.png" alt="" />
            </div>
            <h3>Papelería</h3>
            <p>Libretas, stickers y detalles dreamy.</p>
          </Link>

          <Link to="/productos?categoria=Deco cute" className="category-card">
            <div className="category-icon">
              <img src="/images/icons/cake.png" alt="" />
            </div>
            <h3>Deco cute</h3>
            <p>Objetos tiernos para decorar tu espacio.</p>
          </Link>

          <Link to="/productos?categoria=Accesorios" className="category-card">
            <div className="category-icon">
              <img src="/images/icons/bow.png" alt="" />
            </div>
            <h3>Accesorios</h3>
            <p>Complementos coquette para todos los días.</p>
          </Link>
        </div>
      </section>
    </section>
  );
}

export default Inicio;