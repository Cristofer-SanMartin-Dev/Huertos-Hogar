// src/components/Header.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const Header = () => {
  const { cart } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="py-3 mb-4 border-bottom bg-white shadow-sm sticky-top">
      <div className="container d-flex flex-wrap justify-content-center align-items-center">
        <NavLink to="/" className="d-flex align-items-center mb-2 mb-md-0 me-md-auto text-dark text-decoration-none">
          <span className="fs-4" style={{ fontFamily: 'var(--font-header)' }}>HuertoHogar</span>
        </NavLink>
        <ul className="nav nav-pills">
          <li className="nav-item"><NavLink to="/" className="nav-link">Inicio</NavLink></li>
          <li className="nav-item"><NavLink to="/productos" className="nav-link">Productos</NavLink></li>
          {/* 1. Añadimos el nuevo enlace al Blog */}
          <li className="nav-item"><NavLink to="/blog" className="nav-link">Blog</NavLink></li>
          <li className="nav-item"><NavLink to="/carrito" className="nav-link">Carrito ({cartCount})</NavLink></li>
          
          {isAuthenticated ? (
            <>
              <li className="nav-item"><NavLink to="/perfil" className="nav-link">Mi Perfil</NavLink></li>
              <li className="nav-item">
                <button onClick={handleLogout} className="btn btn-link nav-link text-danger">Cerrar Sesión</button>
              </li>
            </>
          ) : (
            <li className="nav-item"><NavLink to="/login" className="nav-link">Iniciar Sesión</NavLink></li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;