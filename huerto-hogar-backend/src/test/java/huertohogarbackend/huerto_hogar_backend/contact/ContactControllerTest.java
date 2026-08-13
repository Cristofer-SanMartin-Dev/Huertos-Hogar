package huertohogarbackend.huerto_hogar_backend.contact;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String tokenAdmin() throws Exception {
        String adminEmail = "admin@huertohogar.cl";
        Map<String, String> registerBody = Map.of(
                "nombre", "Admin", "apellidos", "Test", "email", adminEmail,
                "password", "Password123!", "calle", "Calle Admin",
                "region", "Metropolitana", "comuna", "Santiago", "telefono", "912345678"
        );
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerBody)))
                .andReturn();

        if (result.getResponse().getStatus() == 200) {
            return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
        }

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", adminEmail, "password", "Password123!"))))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(loginResult.getResponse().getContentAsString()).get("token").asText();
    }

    private String tokenCliente(String email) throws Exception {
        Map<String, String> body = Map.of(
                "nombre", "Cliente", "apellidos", "Test", "email", email,
                "password", "Password123!", "calle", "Calle 1",
                "region", "Metropolitana", "comuna", "Santiago", "telefono", "912345678"
        );
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    @DisplayName("Cualquiera puede enviar un mensaje de contacto sin iniciar sesión")
    void enviarMensajeEsPublico() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "nombre", "Juan Perez", "email", "juan@test.cl", "mensaje", "Tengo una duda"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("Juan Perez"));
    }

    @Test
    @DisplayName("Leer los mensajes de contacto sin token responde 401")
    void leerMensajesSinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/api/contact")).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Un cliente normal no puede leer los mensajes de contacto")
    void leerMensajesComoClienteDevuelve403() throws Exception {
        String clienteToken = tokenCliente("cliente.contacto@test.cl");
        mockMvc.perform(get("/api/contact").header("Authorization", "Bearer " + clienteToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Un admin puede leer los mensajes de contacto y ve el recién enviado")
    void adminPuedeLeerLosMensajes() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "nombre", "Maria Lopez", "email", "maria@test.cl", "mensaje", "Otra consulta"))))
                .andExpect(status().isOk());

        String adminToken = tokenAdmin();
        mockMvc.perform(get("/api/contact").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nombre").value("Maria Lopez"));
    }
}
