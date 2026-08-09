package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

@Data
public class ContactMessageRequest {
    private String nombre;
    private String email;
    private String mensaje;
}
