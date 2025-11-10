import axios from 'axios';

// --- ¡SOLUCIÓN 403 FORBIDDEN! ---
// Configura axios para que envíe cookies (credenciales) en TODAS las peticiones
axios.defaults.withCredentials = true;

// Define la URL base de tu API de Spring Boot
const API_URL = 'http://localhost:8080/api/auth';

/**
 * Esta clase agrupa todas las llamadas de API
 * relacionadas con la autenticación.
 */
class AuthService {
    
    /**
     * Llama al endpoint POST /api/auth/login
     */
    login(email, password) {
        // 'axios.post' ahora enviará las credenciales (cookies)
        return axios.post(`${API_URL}/login`, { 
            email: email, 
            password: password 
        });
    }

    /**
     * Llama al endpoint POST /api/auth/register
     */
    register(user) {
        // 'axios.post' ahora enviará las credenciales
        return axios.post(`${API_URL}/register`, user);
    }

    /**
     * Llama al endpoint PUT /api/auth/profile/{userId}
     */
    updateUser(userId, userData) {
        // Esta petición 'PUT' ahora incluirá la cookie de sesión
        return axios.put(`${API_URL}/profile/${userId}`, userData);
    }
}

// Exportamos una instancia única (Singleton) del servicio.
export default new AuthService();