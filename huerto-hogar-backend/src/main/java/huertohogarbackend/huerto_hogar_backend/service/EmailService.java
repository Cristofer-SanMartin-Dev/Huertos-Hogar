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
 * Envía correo a través de la API HTTP de Brevo (no SMTP).
 *
 * Varios hosts gratuitos (incluido el plan free de Render) bloquean las
 * conexiones SMTP salientes para evitar abuso/spam, así que un envío por
 * SMTP tradicional simplemente nunca llega. La API de Brevo viaja por HTTPS
 * igual que cualquier otra llamada REST, sin ese problema.
 *
 * Se eligió Brevo en vez de Resend porque su plan gratuito solo exige
 * verificar UNA dirección de remitente ("Single Sender", sin necesidad de
 * un dominio propio) y a partir de ahí deja enviar a cualquier destinatario;
 * el sandbox de Resend, en cambio, solo entrega al dueño de la cuenta hasta
 * verificar un dominio completo.
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final RestClient restClient = RestClient.create("https://api.brevo.com");

    @Value("${app.mail.brevo-api-key}")
    private String brevoApiKey;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.mail.from-name}")
    private String fromName;

    private void enviar(String destinatario, String asunto, String texto, String contextoLog) {
        if (brevoApiKey == null || brevoApiKey.isBlank()) {
            logger.warn("BREVO_API_KEY no configurada: se omite el envío del correo de {} a {}.", contextoLog, destinatario);
            return;
        }

        try {
            restClient.post()
                    .uri("/v3/smtp/email")
                    .header("api-key", brevoApiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "sender", Map.of("email", from, "name", fromName),
                            "to", List.of(Map.of("email", destinatario)),
                            "subject", asunto,
                            "textContent", texto
                    ))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            // No se propaga: el cliente igual recibe la respuesta genérica de
            // éxito. Si el correo no llegó, queda en el log del servidor.
            logger.error("No se pudo enviar el correo de {} a {}: {}", contextoLog, destinatario, e.getMessage());
        }
    }

    public void enviarCorreoRecuperacion(String destinatario, String nombre, String resetLink) {
        String texto =
                "Hola " + nombre + ",\n\n" +
                "Recibimos una solicitud para restablecer tu contraseña en HuertoHogar.\n" +
                "Si fuiste tú, entra al siguiente enlace (válido por 1 hora):\n\n" +
                resetLink + "\n\n" +
                "Si no fuiste tú, puedes ignorar este correo: tu contraseña sigue igual.\n\n" +
                "— El equipo de HuertoHogar";

        enviar(destinatario, "Recupera tu contraseña - HuertoHogar", texto, "recuperación");
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
        String estadoTexto = textoEstado(order.getEstado());
        String texto =
                "Hola " + nombre + ",\n\n" +
                "El estado de tu pedido #" + order.getId() + " cambió a: " + estadoTexto + ".\n\n" +
                "Podés ver el detalle completo en tu cuenta de HuertoHogar.\n\n" +
                "— El equipo de HuertoHogar";

        enviar(destinatario, "Tu pedido #" + order.getId() + " está " + estadoTexto.toLowerCase(), texto, "cambio de estado");
    }
}
