import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function NavBar() {
  const { getCartQuantity } = useCart();
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <NavLink to="/">Inicio</NavLink>
      <NavLink to="/productos">Productos</NavLink>

      {user?.rol === "admin" && (
        <NavLink to="/admin/productos">Panel Koyumi</NavLink>
      )}

      {user ? (
        <NavLink to="/perfil">Mi perfil</NavLink>
      ) : (
        <NavLink to="/login">Ingresar</NavLink>
      )}

      <Link to="/carrito" className="cart-widget">
        <img src="/images/icons/cart.png" alt="" className="cart-widget__icon" />
        <span>Carrito</span>
        <strong>{getCartQuantity()}</strong>
      </Link>
    </nav>
  );
}

export default NavBar;