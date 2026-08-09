// Ruta: src/services/contactService.js
import http from './http.js';

/** Mensajes de contacto: enviar es público, leerlos es solo ADMIN. */
class ContactService {

    send({ nombre, email, mensaje }) {
        return http.post('/api/contact', { nombre, email, mensaje });
    }

    getAll() {
        return http.get('/api/contact');
    }
}

export default new ContactService();
