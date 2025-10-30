// TUTOR: El nombre del paquete coincide con tu estructura de carpetas
package huertohogarbackend.huerto_hogar_backend.repository;

// Importamos nuestro nuevo modelo "Product"
import huertohogarbackend.huerto_hogar_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Extiende JpaRepository y le indicamos que manejará
 * entidades de tipo "Product" cuyo ID es de tipo "Long".
 * Spring Data JPA creará automáticamente todos los métodos CRUD (save, findById, etc.).
 */
public interface ProductRepository extends JpaRepository<Product, Long> {
}