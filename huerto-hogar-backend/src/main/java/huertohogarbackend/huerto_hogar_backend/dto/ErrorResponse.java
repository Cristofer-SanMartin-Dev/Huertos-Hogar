package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Forma uniforme de cualquier respuesta de error o mensaje simple de la API:
 * siempre {"message": "..."}, nunca texto plano.
 */
@Data
@AllArgsConstructor
public class ErrorResponse {
    private String message;
}
