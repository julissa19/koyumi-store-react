import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

function NavBar() {
  const { getCartQuantity } = useCart();
  const { user } = useAuth();
  const location = useLocation();

  const [menuAbierto, setMenuAbierto] = useState(false);

  const estaEnPanelAdmin = location.pathname.startsWith("/admin");

  function cerrarMenu() {
    setMenuAbierto(false);
  }

  useEffect(() => {
    cerrarMenu();
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <div className="navbar__desktop">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>

        {user?.rol === "admin" && (
          <div className="admin-menu">
            <button
              type="button"
              className={
                estaEnPanelAdmin
                  ? "admin-menu__trigger admin-menu__trigger--active"
                  : "admin-menu__trigger"
              }
            >
              <span>Panel Koyumi</span>
                <img
                  src="/images/icons/sparkle.png"
                  alt=""
                  className="admin-menu__sparkle"
                />
            </button>

            <div className="admin-menu__dropdown">
              <NavLink to="/admin/productos">
                <span>
                  <img
                    src="/images/icons/admin-products.png"
                    alt=""
                    className="admin-menu__dropdown-icon"
                  />
                </span>
                Gestionar productos
              </NavLink>

              <NavLink to="/admin/cupones">
                <span>
                  <img
                    src="/images/icons/coupon.png"
                    alt=""
                    className="admin-menu__dropdown-icon"
                  />
                </span>
                Cupones
              </NavLink>

              <NavLink to="/admin/pedidos">
                <span>
                  <img
                    src="/images/icons/orders.png"
                    alt=""
                    className="admin-menu__dropdown-icon"
                  />
                </span>
                Pedidos
              </NavLink>
            </div>
          </div>
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
      </div>

      <div className="navbar__mobile">
        <Link to="/carrito" className="cart-widget cart-widget--mobile">
          <img src="/images/icons/cart.png" alt="" className="cart-widget__icon" />
          <span>Carrito</span>
          <strong>{getCartQuantity()}</strong>
        </Link>

        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMenuAbierto(true)}
          aria-label="Abrir menú"
        >
          <img src="/images/icons/menu.png" alt="" className="mobile-menu-button__icon" />
          Menú
        </button>
      </div>

      {menuAbierto && (
        <div className="mobile-menu-backdrop" onClick={cerrarMenu}>
          <aside className="mobile-menu" onClick={(evento) => evento.stopPropagation()}>
            <div className="mobile-menu__header">
              <div>
                <span className="eyebrow">Koyumi</span>
                <h3>Menú cute</h3>
              </div>

              <button
                type="button"
                className="mobile-menu__close"
                onClick={cerrarMenu}
                aria-label="Cerrar menú"
              >
                <img
                  src="/images/icons/close.png"
                  alt=""
                  className="mobile-menu__close-icon"
                />
              </button>
            </div>

            <div className="mobile-menu__links">
              <NavLink to="/" onClick={cerrarMenu}>
                <span>
                  <img src="/images/icons/home.png" alt="" className="mobile-menu__icon" />
                </span>
                Inicio
              </NavLink>

              <NavLink to="/productos" onClick={cerrarMenu}>
                <span>
                  <img src="/images/icons/products.png" alt="" className="mobile-menu__icon" />
                </span>
                Productos
              </NavLink>

              {user ? (
                <NavLink to="/perfil" onClick={cerrarMenu}>
                  <span>
                    <img
                      src="/images/icons/profile.png"
                      alt=""
                      className="mobile-menu__icon"
                    />
                  </span>
                  Mi perfil
                </NavLink>
              ) : (
                <NavLink to="/login" onClick={cerrarMenu}>
                  <span>
                    <img
                      src="/images/icons/profile.png"
                      alt=""
                      className="mobile-menu__icon"
                    />
                  </span>
                  Ingresar
                </NavLink>
              )}

              <NavLink to="/carrito" onClick={cerrarMenu}>
                <span>
                  <img src="/images/icons/cart.png" alt="" className="mobile-menu__icon" />
                </span>
                Carrito ({getCartQuantity()})
              </NavLink>
            </div>

            {user?.rol === "admin" && (
              <div className="mobile-menu__admin">
                <p>Panel admin</p>

                <NavLink to="/admin/productos" onClick={cerrarMenu}>
                  <span>
                    <img src="/images/icons/admin-products.png" alt="" className="mobile-menu__icon" />
                  </span>
                  Gestionar productos
                </NavLink>

                <NavLink to="/admin/cupones" onClick={cerrarMenu}>
                  <span>
                    <img src="/images/icons/coupon.png" alt="" className="mobile-menu__icon" />
                  </span>
                  Cupones
                </NavLink>

                <NavLink to="/admin/pedidos" onClick={cerrarMenu}>
                  <span>
                    <img src="/images/icons/orders.png" alt="" className="mobile-menu__icon" />
                  </span>
                  Pedidos
                </NavLink>
              </div>
            )}
          </aside>
        </div>
      )}
    </nav>
  );
}

export default NavBar;