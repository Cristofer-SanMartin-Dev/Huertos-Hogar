package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

/**
 * TUTOR: Esta es una clase DTO (Data Transfer Object).
 * No es una entidad de base de datos (@Entity), es solo un simple
 * contenedor para transferir datos. En este caso, se usa para
 * recibir el email y la contraseña del frontend cuando
 * alguien intenta iniciar sesión.
 */
@Data // (Lombok) Crea getters, setters, toString, etc.
public class LoginRequest {
    // El DTO solo define los campos que esperamos recibir.
    private String email;
    private String password;
}