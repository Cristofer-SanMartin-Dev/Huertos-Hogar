import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';

const Header = () => {
const { cart } = useCart();
// Seguimos necesitando 'user' para esta lógica
const { isAuthenticated, user, logout } = useAuth();
const navigate = useNavigate();
const [isMenuOpen, setIsMenuOpen] = useState(false);

// Cantidad de PRODUCTOS DISTINTOS en el carrito, no la suma de unidades:
// coincide con lo que ya muestra el checkout ("Tu Carrito 8" son 8 productos
// distintos, aunque sumen 37 unidades entre todos).
const cartCount = cart.length;
const handleLogout = () => {
logout();
navigate('/');
};

return (
<header className="py-3 mb-4 border-bottom bg-white shadow-sm sticky-top">
  <nav className="navbar navbar-expand-lg container">
    {/* Logo de la tienda */}
    <NavLink to="/" className="navbar-brand d-flex align-items-center text-dark text-decoration-none" onClick={() => setIsMenuOpen(false)}>
    <img
    src="/assets/logo-huertohogar.png"
    alt="HuertoHogar Logo"
    className="me-2 logo-img"
    />
     </NavLink>

    {/* Carrito + hamburguesa agrupados: en celular el carrito debe verse
        siempre, aunque el menú esté colapsado (en escritorio ya se ve en la
        lista de abajo, así que este grupo entero se oculta con d-lg-none). */}
    <div className="d-flex align-items-center d-lg-none">
      <NavLink
        to="/carrito"
        className="nav-link position-relative me-2"
        onClick={() => setIsMenuOpen(false)}
        aria-label={`Carrito de compras, ${cartCount} producto${cartCount === 1 ? '' : 's'}`}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
        {cartCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {cartCount}
          </span>
        )}
      </NavLink>
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-label="Abrir menú de navegación"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
    </div>

    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} onClick={() => setIsMenuOpen(false)}>
      {/* Lista de enlaces de navegación pública */}
      <ul className="nav nav-pills ms-auto">
        <li className="nav-item"><NavLink to="/" className="nav-link">Home</NavLink></li>
        <li className="nav-item"><NavLink to="/productos" className="nav-link">Productos</NavLink></li>
        <li className="nav-item"><NavLink to="/categorias" className="nav-link">Categorías</NavLink></li>
        <li className="nav-item"><NavLink to="/ofertas" className="nav-link">Ofertas</NavLink></li>
        <li className="nav-item"><NavLink to="/nosotros" className="nav-link">Nosotros</NavLink></li>
        <li className="nav-item"><NavLink to="/blog" className="nav-link">Blog</NavLink></li>
        <li className="nav-item"><NavLink to="/contacto" className="nav-link">Contacto</NavLink></li>
        <li className="nav-item"><NavLink to="/carrito" className="nav-link">Carrito ({cartCount})</NavLink></li>

        {/* Lógica condicional para Login/Logout */}
        {isAuthenticated ? (
          <>
            {/* 1. Muestra "Panel Admin" SÓLO si el rol es ADMIN */}
            {user && user.role === 'ADMIN' && (
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link text-success">Panel Admin</NavLink>
              </li>
            )}

            {/* 2. Muestra "Mi Perfil" SÓLO si el rol NO es ADMIN */}
            {user && user.role !== 'ADMIN' && (
              <li className="nav-item"><NavLink to="/perfil" className="nav-link">Mi Perfil</NavLink></li>
            )}

            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-link nav-link text-danger">Cerrar Sesión</button>
            </li>
          </>
        ) : (
          <li className="nav-item"><NavLink to="/login" className="nav-link">Iniciar Sesión</NavLink></li>
        )}
      </ul>
    </div>
  </nav>
</header>
);
};

export default Header;
