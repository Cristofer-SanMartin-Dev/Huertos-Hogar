// Ruta: src/test/java/huertohogarbackend/huerto_hogar_backend/security/PasswordResetTest.java
package huertohogarbackend.huerto_hogar_backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import huertohogarbackend.huerto_hogar_backend.model.PasswordResetToken;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.PasswordResetTokenRepository;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Pruebas del flujo de "recuperar contraseña": generación de token,
 * expiración, consumo de un solo uso y que nunca se revele si un email
 * está registrado o no.
 */
@SpringBootTest
@AutoConfigureMockMvc
class PasswordResetTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    private String registrar(String email) throws Exception {
        Map<String, String> body = Map.of(
                "nombre", "Test",
                "apellidos", "Usuario",
                "email", email,
                "password", "Password123!",
                "calle", "Calle 123",
                "region", "Metropolitana",
                "comuna", "Santiago",
                "telefono", "912345678"
        );
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk());
        return email;
    }

    private PasswordResetToken pedirRecuperacionYObtenerToken(String email) throws Exception {
        mockMvc.perform(post("/api/auth/forgot-password")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("email", email))));

        User user = userRepository.findByEmailIgnoreCase(email).orElseThrow();
        return passwordResetTokenRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new AssertionError("No se generó el token de recuperación."));
    }

    @Test
    @DisplayName("Pedir recuperación para un email registrado genera un token y responde 200")
    void pedirRecuperacionConEmailRegistradoGeneraToken() throws Exception {
        String email = registrar("recuperar.valido@test.cl");

        PasswordResetToken token = pedirRecuperacionYObtenerToken(email);

        assertThat(token.getToken()).isNotBlank();
        assertThat(token.getExpiryDate()).isAfter(LocalDateTime.now());
    }

    @Test
    @DisplayName("Pedir recuperación para un email que no existe responde 200 igual (no revela si existe)")
    void pedirRecuperacionConEmailInexistenteNoRevelaNada() throws Exception {
        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("email", "no.existe.jamas@test.cl"))))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Pedir recuperación dos veces seguidas no rompe (el segundo pedido borra el token anterior)")
    void pedirRecuperacionDosVecesSeguidasNoRompe() throws Exception {
        // Regresión: deleteByUser (borra el token anterior antes de crear uno
        // nuevo) es un método de borrado derivado de Spring Data JPA y
        // necesita una transacción activa en cuanto hay una fila real que
        // borrar. Sin @Transactional en el service, este segundo pedido
        // fallaba con 500 (TransactionRequiredException) en producción,
        // aunque nunca en tests: cada otro test usa un email distinto, así
        // que nunca había un token previo que borrar.
        String email = registrar("recuperacion.dos.veces@test.cl");

        pedirRecuperacionYObtenerToken(email);

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("email", email))))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Restablecer con un token válido cambia la contraseña y permite loguearse con la nueva")
    void restablecerConTokenValidoCambiaLaContrasena() throws Exception {
        String email = registrar("restablecer.valido@test.cl");
        PasswordResetToken token = pedirRecuperacionYObtenerToken(email);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", token.getToken(),
                                "newPassword", "NuevaClave123!"))))
                .andExpect(status().isOk());

        // La contraseña vieja ya no sirve...
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", email, "password", "Password123!"))))
                .andExpect(status().isUnauthorized());

        // ...y la nueva sí.
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", email, "password", "NuevaClave123!"))))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("El token se consume: no se puede usar dos veces")
    void tokenUsadoNoSePuedeReutilizar() throws Exception {
        String email = registrar("token.un.solo.uso@test.cl");
        PasswordResetToken token = pedirRecuperacionYObtenerToken(email);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", token.getToken(),
                                "newPassword", "NuevaClave123!"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", token.getToken(),
                                "newPassword", "OtraClave456!"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Un token expirado se rechaza con 400")
    void tokenExpiradoSeRechaza() throws Exception {
        String email = registrar("token.expirado@test.cl");
        PasswordResetToken token = pedirRecuperacionYObtenerToken(email);
        token.setExpiryDate(LocalDateTime.now().minusMinutes(1));
        passwordResetTokenRepository.save(token);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", token.getToken(),
                                "newPassword", "NuevaClave123!"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Un token inexistente se rechaza con 400")
    void tokenInexistenteSeRechaza() throws Exception {
        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", "token-que-no-existe",
                                "newPassword", "NuevaClave123!"))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Restablecer con una contraseña débil se rechaza con 400")
    void restablecerConContrasenaDebilSeRechaza() throws Exception {
        String email = registrar("password.debil.reset@test.cl");
        PasswordResetToken token = pedirRecuperacionYObtenerToken(email);

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "token", token.getToken(),
                                "newPassword", "debil"))))
                .andExpect(status().isBadRequest());
    }
}
