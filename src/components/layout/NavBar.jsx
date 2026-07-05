import { Link, NavLink } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function NavBar() {
  const { getCartQuantity } = useCart();

  const totalItems = getCartQuantity();

  return (
    <nav className="navbar">
      <NavLink to="/">Inicio</NavLink>
      <NavLink to="/productos">Productos</NavLink>

      <Link to="/carrito" className="cart-widget">
        <img src="/images/icons/cart.png" alt="" className="cart-widget__icon" />
        <span>Carrito</span>
        <strong>{totalItems}</strong>
      </Link>
    </nav>
  );
}

export default NavBar;