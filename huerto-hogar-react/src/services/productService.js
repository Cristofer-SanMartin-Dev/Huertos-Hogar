// src/services/productService.js

/**
 * TUTOR: Esta es la versión final de tu base de datos simulada.
 * Todos los productos han sido enriquecidos con las propiedades:
 * - `priceUnit`: Especifica si el precio es por kilo, unidad, etc.
 * - `origin`: Indica el lugar de origen del producto.
 * - `sustainability`: Describe las prácticas sostenibles asociadas.
 * - `recipes`: Un array con ideas de recetas.
 */
const BASE_URL = 'http://localhost:8080/api/products';

    // (GET) /api/products/{id}
    getProductById(id) {
        return axios.get(`${BASE_URL}/${id}`);
    }

    // (POST) /api/products
    createProduct(product) {
        return axios.post(BASE_URL, product);
    }

    // (PUT) /api/products/{id}
    updateProduct(id, product) {
        return axios.put(`${BASE_URL}/${id}`, product);
    }

    // (DELETE) /api/products/{id}
    deleteProduct(id) {
        return axios.delete(`${BASE_URL}/${id}`);
    }
}

// Exportamos una instancia única (Singleton) de la clase,
// como lo hace la guía[cite: 977].
export default new ProductService();
