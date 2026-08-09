// Ruta: src/services/authService.js
import http, { setToken, clearSession } from './http.js';

const AUTH_PATH = '/api/auth';

/**
 * Agrupa las llamadas de API relacionadas con la autenticación.
 *
 * El backend devuelve un JWT en el login y en el registro; aquí se guarda para
 * que el interceptor de http.js lo envíe en las peticiones protegidas.
 */
class AuthService {

    /** POST /api/auth/login */
    login(email, password) {
        return http.post(`${AUTH_PATH}/login`, { email, password })
            .then((response) => {
                setToken(response.data.token);
                return response;
            });
    }

    /**
     * POST /api/auth/register
     *
     * Tras registrarse la app redirige al login, así que aquí NO se guarda el
     * token: dejarlo guardado sin usuario en contexto produciría una sesión a
     * medias. Se limpia cualquier resto de una sesión anterior.
     */
    register(user) {
        clearSession();
        return http.post(`${AUTH_PATH}/register`, user);
    }

    /**
     * PUT /api/auth/profile/{userId}
     * Requiere token. El backend verifica además que el id sea el del propio
     * usuario, así que no se puede editar el perfil de otra persona.
     */
    updateUser(userId, userData) {
        return http.put(`${AUTH_PATH}/profile/${userId}`, userData);
    }

    /** Borra token y usuario del navegador. */
    logout() {
        clearSession();
    }

    /**
     * GET /api/auth/me
     * Trae los datos vigentes del usuario (ej. puntos de fidelidad tras un
     * pedido), que localStorage no actualiza por sí solo entre acciones.
     */
    getCurrentUser() {
        return http.get(`${AUTH_PATH}/me`);
    }
}

export default new AuthService();
