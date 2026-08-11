// Ruta: src/context/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext.js';
import AuthService from '../services/authService.js';
import { getToken, clearSession } from '../services/http.js';

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        // Sin token no hay sesión válida: el backend rechazaría cualquier
        // petición protegida, así que tampoco la damos por buena en el cliente.
        if (savedUser && getToken()) {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        } else {
            clearSession();
        }
        setIsLoading(false);
    }, []);

    const login = (email, password) => {
        return AuthService.login(email, password)
            .then(response => {
                // El token ya lo guardó AuthService; aquí solo conservamos los
                // datos de perfil, sin el token, para no duplicarlo en 'user'.
                const { token, tokenType, ...userData } = response.data;
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
        // Borra token y usuario del navegador en un solo punto.
        AuthService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

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

    /**
     * Vuelve a pedir los datos del usuario al backend y actualiza el estado
     * local. Necesario tras acciones que cambian datos del lado del servidor
     * sin que el cliente los sepa (ej. los puntos de fidelidad al completar
     * un pedido): sin esto, quedarían desactualizados hasta el próximo login.
     */
    const refreshUser = () => {
        return AuthService.getCurrentUser()
            .then(response => {
                const updatedUser = response.data;
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
                return updatedUser;
            });
    };

    const value = {
        isAuthenticated,
        user,
        login,
        logout,
        register,
        isLoading,
        updateUser,
        refreshUser
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
