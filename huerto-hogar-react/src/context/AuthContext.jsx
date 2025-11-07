// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

// TUTOR: Aquí está el cambio clave. Añadimos 'export' para que otros archivos,
// como nuestras pruebas, puedan importar y usar `AuthContext`.
export const AuthContext = createContext();

const simulatedUser = {
  email: 'juan.perez@example.com',
  password: 'Password123!',
  name: 'Juan Pérez',
  address: 'Av. Siempre Viva 123, Santiago'
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isAuthenticated');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
      setUser(simulatedUser);
    }
  }, []);

  const login = (email, password) => {
    if (email === simulatedUser.email && password === simulatedUser.password) {
      localStorage.setItem('isAuthenticated', 'true');
      setIsAuthenticated(true);
      setUser(simulatedUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = { isAuthenticated, user, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};