// TUTOR: El nombre del paquete coincide con tu estructura de carpetas
package huertohogarbackend.huerto_hogar_backend.service;

// Importamos nuestro Modelo y Repositorio
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

/**
 * TUTOR: Esta clase es el "Servicio" .
 * Es el intermediario entre el Controlador (que recibe las peticiones web)
 * y el Repositorio (que habla con la base de datos).
 * Aquí va la lógica de negocio.
 *
 * Adaptamos el 'BookService' de la guía  para 'Product'.
 */
@Service // [cite: 807] Le dice a Spring que esta clase es un Servicio
public class ProductService {

    // @Autowired [cite: 808] le pide a Spring que "inyecte" (nos pase) una instancia
    // de ProductRepository automáticamente.
    @Autowired
    private ProductRepository productRepository;

    // Método para obtener TODOS los productos
    // (Adaptado de 'obtenerTodosLosProductos' 
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Método para obtener UN producto por su ID
    // (Adaptado de 'obtenerProductoPorId')
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Método para guardar (crear o actualizar) un producto
    // (Adaptado de 'guardarProducto' )
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    // Método para eliminar un producto por su ID
    // (Adaptado de 'deleteBook' / 'eliminarProducto' )
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // TUTOR: Más adelante, podríamos añadir lógica de negocio aquí,
    // como validar que el stock no sea negativo al guardar,
    // o aplicar un descuento (como en el ejemplo de la PPT ).
}