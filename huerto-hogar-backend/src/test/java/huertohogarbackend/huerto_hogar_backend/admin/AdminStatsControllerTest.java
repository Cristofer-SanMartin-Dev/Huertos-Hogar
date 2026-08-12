package huertohogarbackend.huerto_hogar_backend.admin;

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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AdminStatsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String tokenAdmin() throws Exception {
        String adminEmail = "admin@huertohogar.cl";
        Map<String, String> registerBody = Map.of(
                "nombre", "Admin", "apellidos", "Test", "email", adminEmail,
                "password", "Password123!", "calle", "Calle Admin",
                "region", "Metropolitana", "comuna", "Santiago", "telefono", "12345678"
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

    @Test
    @DisplayName("Un cliente normal no puede ver las estadísticas del dashboard")
    void statsSinRolAdminDevuelve403() throws Exception {
        Map<String, String> body = Map.of(
                "nombre", "Cliente", "apellidos", "Test", "email", "cliente.stats@test.cl",
                "password", "Password123!", "calle", "Calle 1",
                "region", "Metropolitana", "comuna", "Santiago", "telefono", "12345678"
        );
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();
        String clienteToken = objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();

        mockMvc.perform(get("/api/admin/stats").header("Authorization", "Bearer " + clienteToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Un admin ve las estadísticas con conteos reales")
    void statsComoAdminDevuelveConteos() throws Exception {
        String adminToken = tokenAdmin();

        mockMvc.perform(get("/api/admin/stats").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").exists())
                .andExpect(jsonPath("$.totalProducts").exists())
                .andExpect(jsonPath("$.totalOrders").exists())
                .andExpect(jsonPath("$.totalRevenue").exists());
    }

    @Test
    @DisplayName("Sin token, las estadísticas responden 401")
    void statsSinTokenDevuelve401() throws Exception {
        mockMvc.perform(get("/api/admin/stats")).andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Un admin ve la lista de usuarios, sin exponer la contraseña")
    void usersComoAdminDevuelveListaSinPassword() throws Exception {
        String adminToken = tokenAdmin();

        MvcResult result = mockMvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").exists())
                .andReturn();

        // Busca la clave del campo, no la palabra suelta: un email de prueba de
        // otra clase (ej. "password.debil.reset@test.cl") puede contener la
        // palabra "password" de forma legítima sin que se esté filtrando nada.
        assertThat(result.getResponse().getContentAsString()).doesNotContain("\"password\"");
    }

    @Test
    @DisplayName("Un cliente normal no puede ver la lista de usuarios")
    void usersSinRolAdminDevuelve403() throws Exception {
        Map<String, String> body = Map.of(
                "nombre", "Cliente", "apellidos", "Test", "email", "cliente.users@test.cl",
                "password", "Password123!", "calle", "Calle 1",
                "region", "Metropolitana", "comuna", "Santiago", "telefono", "12345678"
        );
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();
        String clienteToken = objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();

        mockMvc.perform(get("/api/admin/users").header("Authorization", "Bearer " + clienteToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Un admin ve los reportes de productos más vendidos")
    void reportsComoAdminDevuelveEstructuraValida() throws Exception {
        String adminToken = tokenAdmin();

        mockMvc.perform(get("/api/admin/reports").header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.topProductsByQuantity").isArray())
                .andExpect(jsonPath("$.topProductsByRevenue").isArray());
    }
}
