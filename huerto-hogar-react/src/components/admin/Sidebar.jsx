import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// En escritorio el sidebar siempre está visible (comportamiento de antes).
// En celular arranca colapsado y el botón hamburguesa lo despliega; elegir
// una opción lo vuelve a cerrar, como cualquier menú móvil profesional.
const Sidebar = () => {
    const [open, setOpen] = useState(false);
    const closeMenu = () => setOpen(false);

    return (
        <div className={`sidebar ${open ? 'sidebar-open' : ''}`}>
            <div className="sidebar-header">
                <h4 className="mb-0 product-title" style={{ color: 'white' }}>Panel Admin</h4>
                <button
                    type="button"
                    className="sidebar-toggle"
                    onClick={() => setOpen(o => !o)}
                    aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={open}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
            <ul className="nav flex-column sidebar-nav">
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin" end onClick={closeMenu}>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/productos" onClick={closeMenu}>Productos</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/ordenes" onClick={closeMenu}>Órdenes</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/categorias" onClick={closeMenu}>Categorías</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/usuarios" onClick={closeMenu}>Usuarios</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/reportes" onClick={closeMenu}>Reportes</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/mensajes" onClick={closeMenu}>Mensajes</NavLink>
                </li>
                <hr className="text-white" />
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/perfil" onClick={closeMenu}>Perfil</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/" onClick={closeMenu}>Volver a la Tienda</NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
