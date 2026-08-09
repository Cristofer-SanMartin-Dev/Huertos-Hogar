// Ruta: src/services/orderService.js
import http from './http.js';

const ORDERS_PATH = '/api/orders';

/** Pedidos: crear y consultar requiere sesión; cambiar estado y ver todos, ser admin. */
class OrderService {

    create(payload) {
        return http.post(ORDERS_PATH, payload);
    }

    getMine() {
        return http.get(`${ORDERS_PATH}/mine`);
    }

    getAll() {
        return http.get(ORDERS_PATH);
    }

    getById(id) {
        return http.get(`${ORDERS_PATH}/${id}`);
    }

    updateStatus(id, estado) {
        return http.put(`${ORDERS_PATH}/${id}/estado`, { estado });
    }
}

export default new OrderService();
