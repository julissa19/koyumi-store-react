import Directorio from "../team/Directorio";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <section className="footer__brand">
          <div>
            <span className="footer__logo">Koyumi</span>

            <p>
              Tienda online de productos importados con estética modern kawaii,
              coquette y dreamy. Seleccionamos maquillaje, papelería, accesorios,
              deco cute y coleccionables mágicos para quienes aman los detalles
              únicos.
            </p>
          </div>

          <div className="footer__mini">
            <img src="/images/icons/strawberry.png" alt="" className="footer__mini-icon" />
            <p>Importados cute seleccionados con amor.</p>
          </div>
        </section>

        <section className="footer__team">
          <div className="section-heading section-heading--footer">
            <span>Nosotras</span>
            <h2>Equipo Koyumi</h2>
          </div>

          <Directorio />
        </section>

        <div className="footer__bottom">
          <p>© 2026 Koyumi Store. Todos los derechos reservados.</p>
          <p>Modern kawaii · Coquette · Dreamy</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;