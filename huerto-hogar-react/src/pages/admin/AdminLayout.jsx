import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/admin/Sidebar.jsx';

// TUTOR: Este es el "Layout" del admin.
// Funciona igual que el Layout público, pero con un Sidebar
// y un área de contenido (el <Outlet />)
const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-content">
                {/* <Outlet /> renderizará aquí la página de admin actual (DashboardPage, etc.) */}
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout;