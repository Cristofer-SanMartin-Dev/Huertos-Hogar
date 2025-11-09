import axios from 'axios';

// TUTOR: Esta es la URL base de tu API de autenticación.
// Apunta al @RequestMapping("/api/auth") de tu AuthController.
const API_URL = 'http://localhost:8080/api/auth';

/**
 * TUTOR: Esta clase agrupa todas las llamadas de API
 * relacionadas con la autenticación.
 */
class AuthService {
    
    /**
     * Llama al endpoint POST /api/auth/login
     * @param {string} email - El email del usuario
     * @param {string} password - La contraseña del usuario
     * @returns {Promise} - La promesa de Axios con la respuesta del backend
     */
    login(email, password) {
        // Envía un objeto que coincide con el DTO LoginRequest del backend
        return axios.post(API_URL + '/login', { 
            email: email, 
            password: password 
        });
    }

    /**
     * Llama al endpoint POST /api/auth/register
     * @param {object} user - Un objeto con { name, email, password }
     * @returns {Promise} - La promesa de Axios con la respuesta del backend
     */
    register(user) {
        // Envía el objeto de usuario que coincide con el @Entity User del backend
        return axios.post(API_URL + '/register', user);
    }

    // TUTOR: Aquí podríamos añadir un método logout() si el backend lo requiriera,
    // pero por ahora, el logout es solo en el frontend.
}

// Exportamos una instancia única (Singleton) del servicio.
export default new AuthService();