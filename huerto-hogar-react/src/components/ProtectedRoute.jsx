// Ruta: src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate, useLocation } from 'react-router-dom';

// El rol por defecto es 'CUSTOMER', que ahora coincidirá
// con el rol que asigna el backend.
const ProtectedRoute = ({ children, role = 'CUSTOMER' }) => {
    
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

    // 3. (ESTO ES LO QUE ARREGLAMOS)
    // Ahora 'user.role' será "CUSTOMER" y 'role' es "CUSTOMER".
    // La condición ( "CUSTOMER" !== "CUSTOMER" ) será 'false' y permitirá el paso.
    if (user.role !== role) {
        // Esto solo se activará si un CUSTOMER intenta ir a una ruta de ADMIN
        return <Navigate to="/" replace />; 
    }

    // 4. Muestra la página protegida (ej: ProfilePage)
    return children;
};

export default ProtectedRoute;