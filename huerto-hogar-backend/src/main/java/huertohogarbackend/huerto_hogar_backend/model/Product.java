// TUTOR: El nombre del paquete coincide con tu estructura de carpetas
package huertohogarbackend.huerto_hogar_backend.model;

// TUTOR: Usamos `jakarta.persistence` porque estás en Spring Boot 3.
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Hemos añadido los campos que coinciden con tu frontend de HuertoHogar.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; // ID único

    private String name;        // Nombre (ej: "Manzanas Fuji")
    private String description; // Descripción del producto
    private double price;       // Precio (ej: 1200)
    private int stock;          // Stock disponible (ej: 150)
}