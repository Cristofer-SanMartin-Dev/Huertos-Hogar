// Ruta: src/services/http.js
import axios from 'axios';

// Configurable por entorno (ver .env.example) para poder apuntar a un
// backend real al desplegar, sin tener que tocar código.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const TOKEN_KEY = 'token';

/**
 * Instancia única de axios para toda la aplicación.
 *
 * Un interceptor añade automáticamente la cabecera
 * "Authorization: Bearer <token>" a cada petición, de modo que ningún servicio
 * tiene que acordarse de hacerlo. Otro interceptor cierra la sesión local si
 * el backend responde 401 (token vencido o inválido).
 *
 * El backend devuelve los errores como JSON {"message": "..."}, pero todo el
 * código de la app (formularios, toasts) espera error.response.data como
 * string directo — así era antes, cuando el backend mandaba texto plano. En
 * vez de tocar cada pantalla, el interceptor de abajo "desempaqueta" el
 * mensaje acá, en un solo lugar.
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
        const data = error.response?.data;
        if (data && typeof data === 'object' && typeof data.message === 'string') {
            error.response.data = data.message;
        }

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
