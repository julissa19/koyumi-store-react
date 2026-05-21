import { useState } from "react";

function ContactForm() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    producto: "",
    mensaje: ""
  });

  const [enviado, setEnviado] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormulario({
      ...formulario,
      [name]: value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    setEnviado(true);

    setFormulario({
      nombre: "",
      email: "",
      producto: "",
      mensaje: ""
    });
  }

  return (
    <section className="contact-section">
      <div className="section-heading">
        <span>Formulario</span>
        <h2>¿Buscás algo especial?</h2>
        <p>
          Completá el formulario y el equipo de Koyumi te ayuda a encontrar tu
          próximo importado cute.
        </p>
      </div>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            Nombre
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formulario.email}
              onChange={handleChange}
              placeholder="tuemail@mail.com"
              required
            />
          </label>
        </div>

        <label>
          Producto de interés
          <input
            type="text"
            name="producto"
            value={formulario.producto}
            onChange={handleChange}
            placeholder="Ej: paleta, taza, stickers..."
          />
        </label>

        <label>
          Mensaje
          <textarea
            name="mensaje"
            value={formulario.mensaje}
            onChange={handleChange}
            placeholder="Contanos qué producto cute estás buscando"
            rows="5"
            required
          />
        </label>

        <button type="submit" className="btn btn--primary">
          Enviar consulta
        </button>

        {enviado && (
          <p className="form-success">
            Gracias por escribirnos. Tu consulta fue registrada correctamente ✨
          </p>
        )}
      </form>
    </section>
  );
}

export default ContactForm;