import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Perfil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function manejarLogout() {
    await logout();
    navigate("/");
  }

  return (
    <section className="profile-page">
      <div className="profile-card">
        <span className="eyebrow">Mi perfil</span>

        <h2>Hola de nuevo ✨</h2>

        <p>
          Sesión iniciada como:
          <strong> {user.email}</strong>
        </p>

        <div className="profile-role">
          <span>Rol actual</span>
          <strong>{user.rol}</strong>
        </div>

        {user.rol === "admin" && (
          <p>
            Tenés permisos para acceder al Panel Koyumi y gestionar productos.
          </p>
        )}

        <button type="button" className="btn btn--primary" onClick={manejarLogout}>
          Cerrar sesión
        </button>
      </div>
    </section>
  );
}

export default Perfil;