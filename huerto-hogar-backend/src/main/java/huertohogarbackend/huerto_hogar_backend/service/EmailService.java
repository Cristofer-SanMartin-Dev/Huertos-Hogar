// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/service/EmailService.java
package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.model.EstadoPedido;
import huertohogarbackend.huerto_hogar_backend.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Envía correo a través de la API HTTP de Resend (no SMTP).
 *
 * Varios hosts gratuitos (incluido el plan free de Render) bloquean las
 * conexiones SMTP salientes para evitar abuso/spam, así que un envío por
 * SMTP tradicional simplemente nunca llega. La API de Resend viaja por
 * HTTPS igual que cualquier otra llamada REST, sin ese problema.
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final RestClient restClient = RestClient.create("https://api.resend.com");

    @Value("${app.mail.resend-api-key}")
    private String resendApiKey;

    @Value("${app.mail.from}")
    private String from;

    public void enviarCorreoRecuperacion(String destinatario, String nombre, String resetLink) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            logger.warn("RESEND_API_KEY no configurada: se omite el envío del correo de recuperación a {}.", destinatario);
            return;
        }

        String texto =
                "Hola " + nombre + ",\n\n" +
                "Recibimos una solicitud para restablecer tu contraseña en HuertoHogar.\n" +
                "Si fuiste tú, entra al siguiente enlace (válido por 1 hora):\n\n" +
                resetLink + "\n\n" +
                "Si no fuiste tú, puedes ignorar este correo: tu contraseña sigue igual.\n\n" +
                "— El equipo de HuertoHogar";

        try {
            restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + resendApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "from", from,
                            "to", List.of(destinatario),
                            "subject", "Recupera tu contraseña - HuertoHogar",
                            "text", texto
                    ))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            // No se propaga: el cliente igual recibe la respuesta genérica de
            // éxito. Si el correo no llegó, queda en el log del servidor.
            logger.error("No se pudo enviar el correo de recuperación a {}: {}", destinatario, e.getMessage());
        }
    }

    private static String textoEstado(EstadoPedido estado) {
        return switch (estado) {
            case PENDIENTE -> "Pendiente";
            case PREPARANDO -> "En preparación";
            case ENVIADO -> "Enviado";
            case ENTREGADO -> "Entregado";
            case CANCELADO -> "Cancelado";
        };
    }

    public void enviarCorreoCambioEstado(String destinatario, String nombre, Order order) {
        if (resendApiKey == null || resendApiKey.isBlank()) {
            logger.warn("RESEND_API_KEY no configurada: se omite el correo de cambio de estado a {}.", destinatario);
            return;
        }

        String estadoTexto = textoEstado(order.getEstado());
        String texto =
                "Hola " + nombre + ",\n\n" +
                "El estado de tu pedido #" + order.getId() + " cambió a: " + estadoTexto + ".\n\n" +
                "Podés ver el detalle completo en tu cuenta de HuertoHogar.\n\n" +
                "— El equipo de HuertoHogar";

        try {
            restClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + resendApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "from", from,
                            "to", List.of(destinatario),
                            "subject", "Tu pedido #" + order.getId() + " está " + estadoTexto.toLowerCase(),
                            "text", texto
                    ))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            logger.error("No se pudo enviar el correo de cambio de estado a {}: {}", destinatario, e.getMessage());
        }
    }
}
