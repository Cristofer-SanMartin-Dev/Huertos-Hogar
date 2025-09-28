// src/components/Header.jsx
import { NavLink } from 'react-router-dom';

/**
 * TUTOR: Componente para el encabezado de la página.
 * - Usamos `NavLink` de react-router-dom en lugar de `<a>`.
 * Esto permite que el enlace de la página activa reciba una clase "active"
 * automáticamente, lo que facilita darle un estilo diferente.
 * - `cartCount` será una "prop" que recibiremos más adelante desde un estado global.
 */
const Header = ({ cartCount = 0 }) => {
  return (
    <header className="py-3 mb-4 border-bottom bg-white shadow-sm sticky-top">
      <div className="container d-flex flex-wrap justify-content-center align-items-center">
        <NavLink to="/" className="d-flex align-items-center mb-2 mb-md-0 me-md-auto text-dark text-decoration-none">
          <span className="fs-4" style={{ fontFamily: 'var(--font-header)' }}>HuertoHogar</span>
        </NavLink>
        <ul className="nav nav-pills">
          <li className="nav-item"><NavLink to="/" className="nav-link">Inicio</NavLink></li>
          <li className="nav-item"><NavLink to="/productos" className="nav-link">Productos</NavLink></li>
          <li className="nav-item"><NavLink to="/carrito" className="nav-link">Carrito ({cartCount})</NavLink></li>
          <li className="nav-item"><NavLink to="/login" className="nav-link">Iniciar Sesión</NavLink></li>
          <li className="nav-item"><NavLink to="/perfil" className="nav-link d-none">Mi Perfil</NavLink></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;