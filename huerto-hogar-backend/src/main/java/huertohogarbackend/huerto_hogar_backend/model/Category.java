// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/model/Category.java
package huertohogarbackend.huerto_hogar_backend.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Categoría de producto (ej. "Frutas Frescas", prefijo "FR").
 *
 * El prefijo alimenta el código legible de cada producto (FR001, FR002...):
 * nextSequence guarda el próximo correlativo a usar dentro de esta categoría,
 * así nunca se repite un código aunque se creen productos en paralelo.
 */
@Data
@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false, unique = true, length = 4)
    private String prefix;

    @Column(nullable = false)
    private Integer nextSequence = 1;
}
