// src/services/productService.js

/**
 * TUTOR: Este archivo simula tu base de datos o una API.
 * Contiene el array completo de tus productos. Mantener los datos aquí
 * hace que tu código sea más limpio y fácil de mantener.
 *
 * IMPORTANTE: He cambiado las rutas de las imágenes para que funcionen con Vite.
 * Debes crear una carpeta llamada `assets` dentro de tu carpeta `public`
 * y colocar todas tus imágenes de productos (`manzana.png`, `naranja.png`, etc.) allí.
 * La ruta ahora debe ser `/assets/nombre_de_la_imagen.png`.
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
