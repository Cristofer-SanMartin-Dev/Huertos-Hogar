// Ruta: src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/authService.js'; 

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
        setIsLoading(false); 
    }, []);

    const login = (email, password) => {
        return AuthService.login(email, password)
            .then(response => {
                const userData = response.data;
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(userData));
                return userData; 
            });
    };

    const register = (user) => {
        return AuthService.register(user);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
    };

    // --- FUNCIÓN NUEVA AÑADIDA ---
    /**
     * Llama al servicio para actualizar al usuario y actualiza el estado local.
     * @param {object} userData - Objeto con los datos a actualizar
     */
    const updateUser = (userData) => {
        // Asegúrate de que el usuario exista y tenga un ID
        if (!user || !user.id) {
            return Promise.reject(new Error("No hay un usuario autenticado para actualizar."));
        }

        // Devuelve la promesa para que el ProfilePage pueda manejarla
        return AuthService.updateUser(user.id, userData)
            .then(response => {
                const updatedUser = response.data;
                // 1. Actualiza el estado
                setUser(updatedUser);
                // 2. Actualiza el localStorage
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser; // Devuelve el usuario actualizado
            });
    };
    // --- FIN DE LA FUNCIÓN ---

    // --- 3. AÑADE 'updateUser' AL VALOR ---
    const value = { 
        isAuthenticated, 
        user, 
        login, 
        logout, 
        register, 
        isLoading, 
        updateUser // <--- Añadido aquí
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context;
};