// Ruta: src/services/productService.js
import http, { API_BASE_URL } from './http.js';

const PRODUCTS_PATH = '/api/products';
const IMAGE_BASE_URL = `${API_BASE_URL}/images/`; // URL pública para ver imágenes

/**
 * Llamadas al catálogo de productos.
 *
 * Las lecturas (GET) son públicas. Crear, editar y eliminar exigen un token de
 * un usuario con rol ADMIN: el interceptor de http.js lo adjunta y el backend
 * lo verifica antes de tocar la base de datos.
 */
class ProductService {

    getAllProducts() {
        return http.get(PRODUCTS_PATH);
    }

    // Los 3 productos destacados de la portada: más vendidos, desempatados por mejor calificación.
    getFeaturedProducts() {
        return http.get(`${PRODUCTS_PATH}/destacados`);
    }

    // Recomendaciones personalizadas para el usuario logueado. Requiere sesión.
    getRecommendedProducts() {
        return http.get(`${PRODUCTS_PATH}/recomendados`);
    }

    getProductById(id) {
        return http.get(`${PRODUCTS_PATH}/${id}`);
    }

    /** Arma el FormData con los datos del producto y, si existe, la imagen. */
    buildFormData(productData, imageFile) {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('stock', productData.stock);
        formData.append('category', productData.category);

        // Campos opcionales: solo se envían si tienen valor, ya que el backend
        // los recibe como Integer/String y una cadena vacía fallaría al convertir.
        if (productData.origin) formData.append('origin', productData.origin);
        if (productData.sustainability) formData.append('sustainability', productData.sustainability);
        if (productData.recipes) formData.append('recipes', productData.recipes);
        if (productData.descuento !== '' && productData.descuento != null) {
            formData.append('descuento', productData.descuento);
        }
        if (productData.unidadMedida) formData.append('unidadMedida', productData.unidadMedida);

        if (imageFile) {
            formData.append('image', imageFile); // 'image' coincide con @RequestParam en Java
        }
        return formData;
    }

    // CREAR: texto + archivo en multipart. Solo ADMIN.
    createProduct(productData, imageFile) {
        return http.post(PRODUCTS_PATH, this.buildFormData(productData, imageFile), {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    // ACTUALIZAR: igual que crear, pero con PUT. Solo ADMIN.
    updateProduct(id, productData, imageFile) {
        return http.put(`${PRODUCTS_PATH}/${id}`, this.buildFormData(productData, imageFile), {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }

    // ELIMINAR. Solo ADMIN.
    deleteProduct(id) {
        return http.delete(`${PRODUCTS_PATH}/${id}`);
    }

    // REPONER STOCK: suma "cantidad" al stock actual (no lo reemplaza). Solo ADMIN.
    addStock(id, cantidad) {
        return http.post(`${PRODUCTS_PATH}/${id}/stock`, { cantidad });
    }

    /**
     * Helper para obtener la URL completa de la imagen de un producto.
     *
     * Las imágenes se suben a Cloudinary, así que el backend ya devuelve una
     * URL absoluta (empieza con "http"): se usa tal cual. El prefijo
     * IMAGE_BASE_URL solo queda como respaldo para productos viejos que
     * todavía tengan el nombre de archivo local de antes de la migración
     * (esos archivos ya no existen porque Render no tiene disco persistente,
     * pero al menos no rompe si algún registro quedó así).
     */
    getImageUrl(imageName) {
        if (!imageName) return 'https://via.placeholder.com/150';
        if (imageName.startsWith('http')) return imageName;
        return IMAGE_BASE_URL + imageName;
    }
}

export default new ProductService();
