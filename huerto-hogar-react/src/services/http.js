// Ruta: src/services/http.js
import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8080';
const TOKEN_KEY = 'token';

/**
 * Instancia única de axios para toda la aplicación.
 *
 * Un interceptor añade automáticamente la cabecera
 * "Authorization: Bearer <token>" a cada petición, de modo que ningún servicio
 * tiene que acordarse de hacerlo. Otro interceptor cierra la sesión local si
 * el backend responde 401 (token vencido o inválido).
 */
const http = axios.create({
    baseURL: API_BASE_URL,
});

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('user');
};

// --- Petición: adjunta el token si existe ---
http.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// --- Respuesta: si el token caducó o es inválido, se limpia la sesión ---
http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            clearSession();
            // Evita quedar en una pantalla privada con la sesión ya vencida.
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                window.location.assign('/login');
            }
        }
        return Promise.reject(error);
    }
);

export default http;
