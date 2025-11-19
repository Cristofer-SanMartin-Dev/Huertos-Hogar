import axios from 'axios';

const API_URL = 'http://localhost:8080/api/products';
const IMAGE_BASE_URL = 'http://localhost:8080/images/'; // URL para ver imágenes

class ProductService {
    
    getAllProducts() {
        return axios.get(API_URL);
    }

    getProductById(id) {
        return axios.get(`${API_URL}/${id}`);
    }

    // CREAR: Usamos FormData para enviar texto + archivo
    createProduct(productData, imageFile) {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('stock', productData.stock);
        formData.append('category', productData.category);
        
        if (imageFile) {
            formData.append('image', imageFile); // 'image' debe coincidir con @RequestParam en Java
        }

        return axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    // ACTUALIZAR: Igual que crear, pero con PUT
    updateProduct(id, productData, imageFile) {
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('stock', productData.stock);
        formData.append('category', productData.category);
        
        if (imageFile) {
            formData.append('image', imageFile);
        }

        return axios.put(`${API_URL}/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    deleteProduct(id) {
        return axios.delete(`${API_URL}/${id}`);
    }
    
    // Helper para obtener la URL completa de la imagen
    getImageUrl(imageName) {
        if (!imageName) return 'https://via.placeholder.com/150'; // Imagen por defecto
        return IMAGE_BASE_URL + imageName;
    }
}

export default new ProductService();