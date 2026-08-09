import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
const { cart } = useCart();
// Seguimos necesitando 'user' para esta lógica
const { isAuthenticated, user, logout } = useAuth();
const navigate = useNavigate();
const [isMenuOpen, setIsMenuOpen] = useState(false);

const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
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

    {/* Botón hamburguesa: solo visible en pantallas angostas (por debajo de lg) */}
    <button
      className="navbar-toggler"
      type="button"
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      aria-expanded={isMenuOpen}
      aria-label="Abrir menú de navegación"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

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
