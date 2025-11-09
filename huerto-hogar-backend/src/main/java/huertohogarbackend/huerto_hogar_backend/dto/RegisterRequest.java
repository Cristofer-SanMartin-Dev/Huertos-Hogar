package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

/**
 * DTO (Data Transfer Object) para recibir los datos del formulario de registro.
 * Debe coincidir exactamente con el JSON que envía React.
 */
@Data
public class RegisterRequest {
    
    private String name;
    private String email;
    private String password;
    private String address; // <--- El campo que faltaba
    
    // Lombok @Data genera los getters y setters automáticamente
}