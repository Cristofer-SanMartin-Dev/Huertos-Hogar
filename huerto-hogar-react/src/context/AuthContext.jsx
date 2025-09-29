// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Creamos el contexto de Autenticación
const AuthContext = createContext();

// 2. Datos simulados del usuario (reemplaza a tu objeto en validation.js)
const simulatedUser = {
  email: 'juan.perez@example.com',
  password: 'Password123!',
  name: 'Juan Pérez',
  address: 'Av. Siempre Viva 123, Santiago'
};

// 3. Creamos el Proveedor
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // TUTOR: Este efecto se ejecuta al cargar la app para verificar si el usuario
  // ya tenía una sesión activa guardada en localStorage.
  useEffect(() => {
    const loggedInUser = localStorage.getItem('isAuthenticated');
    if (loggedInUser === 'true') {
      setIsAuthenticated(true);
      setUser({ name: simulatedUser.name }); // Guardamos un dato simple del usuario
    }
  }, []);

  // Función para iniciar sesión
  const login = (email, password) => {
    if (email === simulatedUser.email && password === simulatedUser.password) {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setUser({ name: simulatedUser.name });
      return true; // Devuelve true en caso de éxito
    }
    return false; // Devuelve false en caso de fallo
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUser(null);
  };

  // El valor que compartiremos a través del contexto
  const value = {
    isAuthenticated,
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 4. Creamos el hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};