package huertohogarbackend.huerto_hogar_backend.dto;

import huertohogarbackend.huerto_hogar_backend.model.User;
import lombok.Data;

/** Fila de la tabla de usuarios del panel admin. Nunca incluye la contraseña. */
@Data
public class UserSummaryResponse {
    private Long id;
    private String nombre;
    private String apellidos;
    private String email;
    private String telefono;
    private String role;
    private Integer puntos;

    public static UserSummaryResponse from(User user) {
        UserSummaryResponse response = new UserSummaryResponse();
        response.setId(user.getId());
        response.setNombre(user.getNombre());
        response.setApellidos(user.getApellidos());
        response.setEmail(user.getEmail());
        response.setTelefono(user.getTelefono());
        response.setRole(user.getRole());
        response.setPuntos(user.getPuntos());
        return response;
    }
}
