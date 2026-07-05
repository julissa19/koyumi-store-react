import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login, user } = useAuth();
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
    setLoading(true);

    try {
      await login(datosForm.email, datosForm.password);
    } catch (error) {
      console.error(error);
      setError("No se pudo iniciar sesión. Revisá el email y la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">Acceso Koyumi</span>

        <h2>Ingresar a tu cuenta</h2>

        <p>
          Iniciá sesión para acceder a tu perfil. Si tu cuenta tiene rol admin,
          también vas a poder entrar al Panel Koyumi.
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
              placeholder="Tu contraseña"
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn--primary" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;