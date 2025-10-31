// TUTOR: El nombre del paquete coincide con tu estructura de carpetas
package huertohogarbackend.huerto_hogar_backend.controller;

// Importamos nuestro Modelo y Servicio
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.service.ProductService;

// Importaciones de Spring para crear el controlador REST
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

// Importaciones de Swagger (OpenAPI) para la documentación 
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * TUTOR: Esta clase es el "Controlador REST". Reemplaza a 'BookController' .
 * Recibe las peticiones HTTP (como GET, POST, PUT, DELETE) desde el exterior.
 */
@RestController // @RestController: Anotación clave que combina @Controller y @ResponseBody.
                // Le dice a Spring que esta clase manejará peticiones REST y devolverá JSON. 
@RequestMapping("/api/products") // @RequestMapping: Define la URL base para todos los métodos en esta clase. 
                                 // Todas las peticiones a esta API empezarán con /api/products.
@Tag(name = "Gestión de Productos", description = "API para el CRUD de productos de HuertoHogar") // @Tag: Título de la sección en Swagger [cite: 112]
public class ProductController {

    // Inyecta automáticamente una instancia de nuestro ProductService
    @Autowired
    private ProductService productService;

    // --- Endpoint 1: Obtener TODOS los productos (READ) ---
    @GetMapping // @GetMapping: Mapea este método a peticiones HTTP GET a la URL base (/api/products)
    @Operation(summary = "Obtener una lista de todos los productos") // @Operation: Descripción en Swagger 
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // --- Endpoint 2: Obtener UN producto por ID (READ) ---
    @GetMapping("/{id}") // Mapea peticiones GET a /api/products/1 (o cualquier ID)
    @Operation(summary = "Obtener un producto por su ID")
    public Optional<Product> getProductById(@PathVariable Long id) { // @PathVariable: Toma el "id" de la URL y lo pasa como variable
        return productService.getProductById(id);
    }

    // --- Endpoint 3: Crear un nuevo producto (CREATE) ---
    @PostMapping // @PostMapping: Mapea peticiones HTTP POST a /api/products
    @Operation(summary = "Añadir un nuevo producto")
    public Product createProduct(@RequestBody Product product) { // @RequestBody: Toma el JSON enviado en el cuerpo
                                                                // de la petición y lo convierte en un objeto Product
        return productService.saveProduct(product);
    }

    // --- Endpoint 4: Actualizar un producto existente (UPDATE) ---
    @PutMapping("/{id}") // @PutMapping: Mapea peticiones HTTP PUT a /api/products/1
    @Operation(summary = "Actualizar un producto existente")
    public Product updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        // Busca el producto existente en la base de datos
        Optional<Product> optionalProduct = productService.getProductById(id);

        if (optionalProduct.isPresent()) {
            // Si existe, actualiza sus campos con los datos recibidos
            Product existingProduct = optionalProduct.get();
            existingProduct.setName(productDetails.getName());
            existingProduct.setDescription(productDetails.getDescription());
            existingProduct.setPrice(productDetails.getPrice());
            existingProduct.setStock(productDetails.getStock());
            // Guarda y devuelve el producto actualizado
            return productService.saveProduct(existingProduct);
        }
        // Si no se encuentra, devuelve null (más adelante manejaremos esto con errores)
        return null;
    }

    // --- Endpoint 5: Eliminar un producto (DELETE) ---
    @DeleteMapping("/{id}") // @DeleteMapping: Mapea peticiones HTTP DELETE a /api/products/1
    @Operation(summary = "Eliminar un producto por su ID")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}