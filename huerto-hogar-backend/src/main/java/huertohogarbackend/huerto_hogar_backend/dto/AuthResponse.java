// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/dto/AuthResponse.java
package huertohogarbackend.huerto_hogar_backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import huertohogarbackend.huerto_hogar_backend.model.User;
import lombok.Data;

/**
 * Respuesta de login y registro.
 *
 * Devuelve los datos del usuario que el frontend necesita para pintar la UI,
 * más el token JWT que deberá enviar en cada petición protegida.
 * Nunca incluye la contraseña, ni siquiera hasheada.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // Si no hay token nuevo, el campo no viaja
public class AuthResponse {

    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String calle;
    private String region;
    private String comuna;
    private String telefono;
    private String role;
    private Integer puntos; // Solo lectura: el cliente nunca puede enviar esto

    private String token;
    private String tokenType = "Bearer";

    public static AuthResponse from(User user, String token) {
        AuthResponse response = new AuthResponse();
        response.setId(user.getId());
        response.setNombre(user.getNombre());
        response.setApellidos(user.getApellidos());
        response.setEmail(user.getEmail());
        response.setCalle(user.getCalle());
        response.setRegion(user.getRegion());
        response.setComuna(user.getComuna());
        response.setTelefono(user.getTelefono());
        response.setRole(user.getRole());
        response.setPuntos(user.getPuntos());
        response.setToken(token);
        return response;
    }

    /** Variante sin token, para respuestas donde el cliente ya tiene uno vigente. */
    public static AuthResponse from(User user) {
        return from(user, null);
    }
}
