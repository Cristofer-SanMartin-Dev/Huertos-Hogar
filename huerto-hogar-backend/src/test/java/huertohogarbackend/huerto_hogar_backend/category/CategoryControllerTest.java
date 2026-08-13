package huertohogarbackend.huerto_hogar_backend.category;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class CategoryControllerTest {

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

    @Test
    @DisplayName("Cualquiera puede listar las categorías, e incluye las 4 base")
    void listarCategoriasEsPublico() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode categorias = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(categorias.isArray()).isTrue();
        assertThat(categorias.size()).isGreaterThanOrEqualTo(4);
    }

    @Test
    @DisplayName("Un cliente normal no puede crear categorías")
    void crearCategoriaSinRolAdminDevuelve403() throws Exception {
        Map<String, String> body = Map.of(
                "nombre", "Cliente", "apellidos", "Test", "email", "cliente.cat@test.cl",
                "password", "Password123!", "calle", "Calle 1",
                "region", "Metropolitana", "comuna", "Santiago", "telefono", "912345678"
        );
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();
        String clienteToken = objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();

        mockMvc.perform(post("/api/categories")
                        .header("Authorization", "Bearer " + clienteToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", "Congelados", "prefix", "CO"))))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Un admin puede crear una categoría nueva y luego eliminarla")
    void adminCreaYEliminaCategoria() throws Exception {
        String adminToken = tokenAdmin();
        String nombre = "Congelados " + UUID.randomUUID();

        MvcResult result = mockMvc.perform(post("/api/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", nombre, "prefix", "co"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.prefix").value("CO"))
                .andReturn();

        Long id = objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(delete("/api/categories/" + id).header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("No se puede crear dos categorías con el mismo nombre")
    void crearCategoriaConNombreDuplicadoDevuelve400() throws Exception {
        String adminToken = tokenAdmin();
        String nombre = "Duplicada " + UUID.randomUUID();

        mockMvc.perform(post("/api/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", nombre, "prefix", "DU"))))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/categories")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("name", nombre, "prefix", "D2"))))
                .andExpect(status().isBadRequest());
    }
}
