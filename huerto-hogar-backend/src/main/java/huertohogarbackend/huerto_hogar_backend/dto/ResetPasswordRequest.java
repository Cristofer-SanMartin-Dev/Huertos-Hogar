// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/dto/ResetPasswordRequest.java
package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String code;
    private String newPassword;
}
