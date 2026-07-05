import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Registro() {
  const { signup, user } = useAuth();
  const navigate = useNavigate();

  const [datosForm, setDatosForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
        navigate("/perfil", { replace: true });
    }
    }, [user, navigate]);
  

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setDatosForm({
      ...datosForm,
      [name]: value
    });
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");

    if (datosForm.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await signup(datosForm.email, datosForm.password);
    } catch (error) {
      console.error(error);

      if (error.code === "auth/email-already-in-use") {
        setError("Ese email ya está registrado. Probá iniciar sesión.");
      } else {
        setError("No se pudo crear la cuenta. Revisá los datos.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">Nueva cuenta</span>

        <h2>Crear cuenta Koyumi</h2>

        <p>
          Registrate como cliente. Las cuentas nuevas se crean con rol user.
        </p>

        <form className="auth-form" onSubmit={manejarEnvio}>
          <label>
            Email
            <input
              type="email"
              name="email"
              value={datosForm.email}
              onChange={manejarCambio}
              placeholder="tuemail@mail.com"
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              name="password"
              value={datosForm.password}
              onChange={manejarCambio}
              placeholder="Mínimo 6 caracteres"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tenés cuenta? <Link to="/login">Ingresar</Link>
        </p>
      </div>
    </section>
  );
}

export default Registro;