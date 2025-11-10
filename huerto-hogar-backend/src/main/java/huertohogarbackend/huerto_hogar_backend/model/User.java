// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/model/User.java
package huertohogarbackend.huerto_hogar_backend.model;

import jakarta.persistence.*; 
import lombok.Data;

@Data 
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- CAMPOS MODIFICADOS ---
    private String nombre;    // Renombrado desde 'name'
    private String apellidos; // Nuevo campo
    
    @Column(unique = true) 
    private String email;

    private String password; 

    private String calle;     // Renombrado desde 'address'
    private String region;    // Nuevo campo
    private String comuna;    // Nuevo campo
    // --- FIN DE MODIFICADOS ---

    private String role;
}