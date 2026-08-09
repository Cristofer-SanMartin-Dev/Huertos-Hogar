// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/model/User.java
package huertohogarbackend.huerto_hogar_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    // @JsonIgnore: el hash nunca se serializa en una respuesta de la API.
    // Se acepta al recibirlo (WRITE_ONLY no aplica aquí porque el registro usa DTO).
    @JsonIgnore
    private String password;

    private String calle;     // Renombrado desde 'address'
    private String region;    // Nuevo campo
    private String comuna;    // Nuevo campo
    private String telefono;  // Número de contacto
    // --- FIN DE MODIFICADOS ---

    private String role;

    // Puntos del programa de fidelización: 1 punto por cada $1.000 en compras.
    private Integer puntos = 0;
}