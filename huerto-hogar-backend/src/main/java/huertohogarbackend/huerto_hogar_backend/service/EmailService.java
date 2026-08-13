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

    private static final String COLOR_MARCA = "#2e7d32";
    private static final String COLOR_FONDO = "#f4f6f4";
    private static final String COLOR_TEXTO = "#2b2b2b";
    private static final String COLOR_TEXTO_MUTED = "#8a8a8a";

    private final RestClient restClient = RestClient.create("https://api.brevo.com");

    @Value("${app.mail.brevo-api-key}")
    private String brevoApiKey;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.mail.from-name}")
    private String fromName;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    /** Envuelve el contenido propio de cada correo en la misma cabecera/pie con el logo de HuertoHogar. */
    private String envolverHtml(String contenidoHtml) {
        String logoUrl = frontendUrl + "/assets/logo-huertohogar.png";
        return "<!DOCTYPE html><html lang=\"es\"><body style=\"margin:0;padding:0;background-color:" + COLOR_FONDO + ";font-family:Arial, Helvetica, sans-serif;\">"
                + "<table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"background-color:" + COLOR_FONDO + ";padding:32px 16px;\">"
                + "<tr><td align=\"center\">"
                + "<table role=\"presentation\" width=\"480\" cellpadding=\"0\" cellspacing=\"0\" style=\"max-width:480px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.06);\">"
                + "<tr><td style=\"background-color:" + COLOR_MARCA + ";padding:24px;text-align:center;\">"
                + "<img src=\"" + logoUrl + "\" alt=\"HuertoHogar\" height=\"44\" style=\"display:block;margin:0 auto;\">"
                + "</td></tr>"
                + "<tr><td style=\"padding:32px 32px 24px 32px;color:" + COLOR_TEXTO + ";font-size:15px;line-height:1.6;\">"
                + contenidoHtml
                + "</td></tr>"
                + "<tr><td style=\"padding:16px 32px 28px 32px;color:" + COLOR_TEXTO_MUTED + ";font-size:12px;text-align:center;border-top:1px solid #eee;\">"
                + "HuertoHogar — Productos frescos del campo a tu hogar"
                + "</td></tr>"
                + "</table></td></tr></table></body></html>";
    }

    private void enviar(String destinatario, String asunto, String textoPlano, String contenidoHtml, String contextoLog) {
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
                            "textContent", textoPlano,
                            "htmlContent", envolverHtml(contenidoHtml)
                    ))
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            // No se propaga: el cliente igual recibe la respuesta genérica de
            // éxito. Si el correo no llegó, queda en el log del servidor.
            logger.error("No se pudo enviar el correo de {} a {}: {}", contextoLog, destinatario, e.getMessage());
        }
    }

    public void enviarCorreoRecuperacion(String destinatario, String nombre, String codigo) {
        String textoPlano =
                "Hola " + nombre + ",\n\n" +
                "Recibimos una solicitud para restablecer tu contraseña en HuertoHogar.\n" +
                "Tu código de verificación (válido por 15 minutos) es:\n\n" +
                codigo + "\n\n" +
                "Ingresalo en la plataforma para elegir una contraseña nueva.\n" +
                "Si no fuiste vos, podés ignorar este correo: tu contraseña sigue igual.\n\n" +
                "— El equipo de HuertoHogar";

        String html =
                "<p style=\"margin-top:0;\">Hola " + nombre + ",</p>"
                + "<p>Recibimos una solicitud para restablecer tu contraseña en HuertoHogar. Usá este código en la plataforma (válido por 15 minutos):</p>"
                + "<div style=\"text-align:center;margin:28px 0;\">"
                + "<span style=\"display:inline-block;background-color:#eaf4ea;color:" + COLOR_MARCA + ";font-size:32px;font-weight:bold;letter-spacing:10px;padding:16px 20px;border-radius:8px;\">"
                + codigo + "</span></div>"
                + "<p style=\"margin-bottom:0;\">Si no fuiste vos, podés ignorar este correo: tu contraseña sigue igual.</p>";

        enviar(destinatario, "Tu código de recuperación - HuertoHogar", textoPlano, html, "recuperación");
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

        String textoPlano =
                "Hola " + nombre + ",\n\n" +
                "El estado de tu pedido #" + order.getId() + " cambió a: " + estadoTexto + ".\n\n" +
                "Podés ver el detalle completo en tu cuenta de HuertoHogar.\n\n" +
                "— El equipo de HuertoHogar";

        String html =
                "<p style=\"margin-top:0;\">Hola " + nombre + ",</p>"
                + "<p>El estado de tu pedido <strong>#" + order.getId() + "</strong> cambió a:</p>"
                + "<div style=\"text-align:center;margin:24px 0;\">"
                + "<span style=\"display:inline-block;background-color:#eaf4ea;color:" + COLOR_MARCA + ";font-size:20px;font-weight:bold;padding:10px 24px;border-radius:999px;\">"
                + estadoTexto + "</span></div>"
                + "<p style=\"margin-bottom:0;\">Podés ver el detalle completo en tu cuenta de HuertoHogar.</p>";

        enviar(destinatario, "Tu pedido #" + order.getId() + " está " + estadoTexto.toLowerCase(), textoPlano, html, "cambio de estado");
    }
}
