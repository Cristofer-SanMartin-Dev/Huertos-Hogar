// src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * TUTOR: Este es un componente "Wrapper" o envoltorio para proteger rutas.
 * Su lógica es simple pero muy potente:
 * 1. Usa el hook `useAuth` para verificar si el usuario está autenticado (`isAuthenticated`).
 * 2. Si `isAuthenticated` es `false`, no renderiza la página que se le pasó como `children`.
 * En su lugar, usa el componente `<Navigate>` de React Router para redirigir
 * al usuario a la página de login (`/login`).
 * 3. Si `isAuthenticated` es `true`, simplemente renderiza los `children` (es decir, la página
 * que se quería proteger, como ProfilePage).
 * `useLocation` y `replace` son optimizaciones para mejorar la experiencia de usuario
 * al manejar el historial de navegación.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirige al login, pero recuerda a qué página quería ir el usuario (`state: { from: location }`)
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;