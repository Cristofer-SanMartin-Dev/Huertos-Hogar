// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/authService.js'; // Importa el servicio de API

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Para manejar la carga inicial

    // Al cargar la app, revisa si hay un usuario guardado en localStorage
    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
        setIsLoading(false); // Termina de cargar
    }, []);

    // Función de LOGIN (ahora llama a la API)
    const login = (email, password) => {
        // Devuelve la promesa para que LoginPage pueda manejarla
        return AuthService.login(email, password)
            .then(response => {
                // Si la API responde OK (200)
                const userData = response.data;
                setUser(userData);
                setIsAuthenticated(true);
                // Guarda al usuario en localStorage para persistir la sesión
                localStorage.setItem('user', JSON.stringify(userData));
                return userData; // Devuelve los datos para la redirección
            });
    };

    // CÓDIGO CORREGIDO
const register = (user) => {
    // 'user' es el objeto { name, email, password, address } que viene de RegisterPage
    // Lo pasamos directamente al servicio
     return AuthService.register(user);
};

    // Función de LOGOUT (limpia el estado y localStorage)
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    const value = { isAuthenticated, user, login, logout, register, isLoading };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};