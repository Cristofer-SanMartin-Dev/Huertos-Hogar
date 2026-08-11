// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/service/EmailService.java
package huertohogarbackend.huerto_hogar_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    public void enviarCorreoRecuperacion(String destinatario, String nombre, String resetLink) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(destinatario);
        message.setSubject("Recupera tu contraseña - HuertoHogar");
        message.setText(
                "Hola " + nombre + ",\n\n" +
                "Recibimos una solicitud para restablecer tu contraseña en HuertoHogar.\n" +
                "Si fuiste tú, entra al siguiente enlace (válido por 1 hora):\n\n" +
                resetLink + "\n\n" +
                "Si no fuiste tú, puedes ignorar este correo: tu contraseña sigue igual.\n\n" +
                "— El equipo de HuertoHogar"
        );
        mailSender.send(message);
    }
}
