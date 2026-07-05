import ItemListContainer from "../components/products/ItemListContainer";
import ContactForm from "../components/form/ContactForm";

function Productos() {
  return (
    <section className="products-page">
      <div className="page-hero">
        <span className="eyebrow">Catálogo Koyumi</span>

        <h2>Productos importados cute</h2>

        <p>
          Una selección de maquillaje, papelería, deco, accesorios y coleccionables
          mágicos para regalar, usar o coleccionar.
        </p>
      </div>

      <ItemListContainer />

      <ContactForm />
    </section>
  );
}

export default Productos;