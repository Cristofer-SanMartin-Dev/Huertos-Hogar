import React from 'react';
import { NavLink } from 'react-router-dom';

// TUTOR: Este es el menú de navegación lateral para el admin.
// Sigue el diagrama de flujo (Figura 10) del Anexo 1.
const Sidebar = () => {
    return (
        <div className="sidebar">
            <h4 className="mb-4 product-title" style={{color: 'white'}}>Panel Admin</h4>
            <ul className="nav flex-column">
                <li className="nav-item">
                    {/* Usamos NavLink para que el enlace activo se resalte */}
                    <NavLink className="nav-link" to="/admin" end>Dashboard</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/productos">Productos</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/ordenes">Órdenes</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/categorias">Categorías</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/usuarios">Usuarios</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/reportes">Reportes</NavLink>
                </li>
                <hr className="text-white" />
                <li className="nav-item">
                    <NavLink className="nav-link" to="/admin/perfil">Perfil</NavLink>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link" to="/">Volver a la Tienda</NavLink>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;