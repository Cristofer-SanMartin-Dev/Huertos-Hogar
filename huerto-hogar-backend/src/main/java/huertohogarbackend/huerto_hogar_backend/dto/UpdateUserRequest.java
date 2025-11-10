// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/dto/UpdateUserRequest.java
package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

/**
 * DTO para recibir los datos de actualización del perfil.
 * Contiene solo los campos que el usuario puede editar.
 */
@Data
public class UpdateUserRequest {
    
    private String nombre;
    private String apellidos;
    private String calle;
    private String region;
    private String comuna;

    // Nota: Omitimos email, password y role a propósito.
}