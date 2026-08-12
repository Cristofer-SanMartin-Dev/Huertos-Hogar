// Ruta: src/services/categoryService.js
import http from './http.js';

const CATEGORIES_PATH = '/api/categories';

/**
 * Llamadas a las categorías de producto.
 *
 * Lectura pública; crear y eliminar exigen rol ADMIN (el interceptor de
 * http.js adjunta el token y el backend lo verifica).
 */
class CategoryService {
    getAllCategories() {
        return http.get(CATEGORIES_PATH);
    }

    createCategory(name, prefix) {
        return http.post(CATEGORIES_PATH, { name, prefix });
    }

    deleteCategory(id) {
        return http.delete(`${CATEGORIES_PATH}/${id}`);
    }
}

export default new CategoryService();
