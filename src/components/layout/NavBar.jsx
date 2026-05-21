import { Link, NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/">Inicio</NavLink>
      <NavLink to="/productos">Productos</NavLink>

      <Link to="/carrito" className="cart-widget">
        <img src="/images/icons/cart.png" alt="" className="cart-widget__icon" />
        <span>Carrito</span>
        <strong>0</strong>
      </Link>
    </nav>
  );
}

export default NavBar;