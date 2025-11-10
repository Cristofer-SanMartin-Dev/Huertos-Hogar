// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/dto/RegisterRequest.java
package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    
    // --- CAMPOS MODIFICADOS ---
    private String nombre;    // Renombrado desde 'name'
    private String apellidos; // Nuevo campo
    private String email;
    private String password;
    private String calle;     // Renombrado desde 'address'
    private String region;    // Nuevo campo
    private String comuna;    // Nuevo campo
    // --- FIN DE MODIFICADOS ---
}