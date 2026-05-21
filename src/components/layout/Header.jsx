import NavBar from "./NavBar";

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <div className="brand">
          <img
            src="/images/logo-koyumi.png"
            alt="Logo Koyumi"
            className="brand__logo-icon"
          />

          <div>
            <h1 className="brand__logo">Koyumi</h1>
            <p className="brand__subtitle">
              Importados cute para regalar, coleccionar y enamorarte
            </p>
          </div>
        </div>

        <NavBar />
      </div>
    </header>
  );
}

export default Header;