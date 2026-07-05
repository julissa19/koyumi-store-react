import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <section className="products-page">
        <div className="state-box">
          <span>✨</span>
          <p>Verificando sesión...</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;