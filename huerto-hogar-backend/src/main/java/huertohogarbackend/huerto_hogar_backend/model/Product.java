package huertohogarbackend.huerto_hogar_backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(length = 1000) // Permite descripciones largas
    private String description;
    
    private Double price;
    
    private Integer stock;
    
    private String category; // Ej: "Frutas", "Verduras"

    // Aquí guardaremos solo el nombre del archivo (ej: "manzana-123.jpg")
    private String imageName;

    // --- Información adicional del producto (opcional) ---
    private String origin; // Lugar de origen, ej. "Valle del Maule"

    @Column(length = 1000)
    private String sustainability; // Prácticas o certificaciones sostenibles

    @Column(length = 1000)
    private String recipes; // Ideas de recetas, texto libre separado por comas

    // Porcentaje de descuento (0-100). Nulo o 0 significa que no está en oferta.
    private Integer descuento;

    // Unidad en la que se vende el producto: "kilo", "unidad", "bolsa 500g",
    // "frasco 500g", "litro", etc. No todos los productos se venden por unidad.
    private String unidadMedida = "unidad";

    /**
     * Precio que realmente se cobra: con descuento aplicado si corresponde.
     * Única fuente de verdad para "cuánto cuesta esto ahora mismo" — la
     * usan tanto ProductResponse (catálogo) como OrderService (al crear un
     * pedido), para que nunca queden desincronizados entre sí.
     */
    public Double getPrecioFinal() {
        if (descuento != null && descuento > 0 && price != null) {
            double descontado = price * (1 - descuento / 100.0);
            return Math.round(descontado * 100.0) / 100.0;
        }
        return price;
    }
}