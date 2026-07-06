import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import KoyumiLoader from "../ui/KoyumiLoader";

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <section className="products-page">
        <KoyumiLoader text="Verificando sesión..." />
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