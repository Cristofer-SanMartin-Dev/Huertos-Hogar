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

    /** Helper para obtener la URL completa de la imagen de un producto. */
    getImageUrl(imageName) {
        if (!imageName) return 'https://via.placeholder.com/150';
        return IMAGE_BASE_URL + imageName;
    }
}

export default new ProductService();
