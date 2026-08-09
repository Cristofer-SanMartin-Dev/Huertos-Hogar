// Ruta: src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate, useLocation } from 'react-router-dom';

// Sin 'role', solo exige sesión iniciada (cualquier rol). Pasar role="ADMIN"
// para restringir además a ese rol específico, como hace el panel de admin.
const ProtectedRoute = ({ children, role }) => {

    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    // 1. Muestra "Cargando..." mientras AuthContext revisa localStorage
    if (isLoading) {
        return <div className="container text-center py-5"><h2>Cargando...</h2></div>;
    }

    // 2. Si terminó de cargar y no está autenticado, lo manda al login
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Si se pidió un rol específico (ej. "ADMIN"), lo exige.
    if (role && user.role !== role) {
        return <Navigate to="/" replace />;
    }

    // 4. Muestra la página protegida (ej: ProfilePage)
    return children;
};

export default ProtectedRoute;