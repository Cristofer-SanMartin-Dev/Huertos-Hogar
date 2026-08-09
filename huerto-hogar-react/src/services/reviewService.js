// Ruta: src/services/reviewService.js
import http from './http.js';

/** Reseñas de productos: lectura pública, publicar requiere sesión iniciada. */
class ReviewService {

    getByProduct(productId) {
        return http.get(`/api/products/${productId}/reviews`);
    }

    create(productId, { rating, comment }) {
        return http.post(`/api/products/${productId}/reviews`, { rating, comment });
    }
}

export default new ReviewService();
