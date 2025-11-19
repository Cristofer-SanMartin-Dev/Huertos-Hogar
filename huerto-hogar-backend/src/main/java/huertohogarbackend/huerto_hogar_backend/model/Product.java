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
}