// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role = 'CUSTOMER' }) => {
    
    // Obtenemos 'isLoading' del contexto
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    // Verificación de Carga:
    if (isLoading) {
        // Muestra un mensaje mientras se verifica la sesión en localStorage
        return <div className="container text-center py-5"><h2>Cargando...</h2></div>;
    }

    // Verificación de Autenticación (si ya no está cargando):
    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Verificación de Rol:
    if (user.role !== role) {
        return <Navigate to="/" replace />; // Redirige al inicio si el rol no coincide
    }

    // Si pasa todo, muestra la página protegida.
    return children;
};

export default ProtectedRoute;