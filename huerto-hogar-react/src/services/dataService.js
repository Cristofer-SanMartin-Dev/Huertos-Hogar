// src/services/productService.js
import axios from 'axios';

/**
 * TUTOR: Esta es la URL base de tu API de backend.
 * Apunta a la ruta que definimos en el @RequestMapping de tu ProductController.
 */
const BASE_URL = 'http://localhost:8080/api/products';

/**
 * TUTOR: Esta clase es nuestro "adaptador" de API.
 * Cada método aquí usa Axios para hacer una llamada HTTP a nuestro backend.
 * Está adaptado del 'BookService.js' de la guía.
 */
class ProductService {

    // (GET) /api/products
    getAllProducts() {
        return axios.get(BASE_URL);
    }

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

// Exportamos una instancia única (Singleton) de la clase.
export default new ProductService();