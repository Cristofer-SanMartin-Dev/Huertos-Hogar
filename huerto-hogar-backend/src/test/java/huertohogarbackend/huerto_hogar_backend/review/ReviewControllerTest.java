package huertohogarbackend.huerto_hogar_backend.review;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Pruebas de reseñas de productos: cualquier cuenta autenticada puede dejar
 * una, nadie anónimo puede publicar, y el rating fuera de rango se rechaza.
 */
@SpringBootTest
@AutoConfigureMockMvc
class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String registrarYObtenerToken(String email) throws Exception {
        Map<String, String> body = Map.of(
                "nombre", "Test", "apellidos", "Usuario", "email", email,
                "password", "Password123!", "calle", "Calle 123",
                "region", "Metropolitana", "comuna", "Santiago", "telefono", "912345678"
        );
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("token").asText();
    }

    /** Crea un producto real vía el endpoint admin, usando la cuenta admin configurada en test. */
    private Long crearProducto(String adminToken) throws Exception {
        MockMultipartFile image = new MockMultipartFile("image", "test.png", "image/png", new byte[]{1, 2, 3});
        MvcResult result = mockMvc.perform(multipart("/api/products")
                        .file(image)
                        .param("name", "Producto de prueba")
                        .param("description", "Para reseñas")
                        .param("price", "1000")
                        .param("stock", "10")
                        .param("category", "Frutas Frescas")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();
        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    /**
     * El email admin (app.admin.email en las propiedades de test) solo puede
     * registrarse una vez: el contexto de Spring (y su H2) se reutiliza entre
     * los métodos de esta clase, así que del segundo test en adelante ya
     * existe. Si el registro falla porque el email está en uso, inicia sesión
     * con esa misma cuenta en su lugar.
     */
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
    @DisplayName("Cualquiera puede leer las reseñas de un producto sin iniciar sesión")
    void listarReseñasEsPublico() throws Exception {
        Long productId = crearProducto(tokenAdmin());

        mockMvc.perform(get("/api/products/" + productId + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("Publicar una reseña sin token responde 401")
    void publicarSinTokenDevuelve401() throws Exception {
        Long productId = crearProducto(tokenAdmin());

        mockMvc.perform(post("/api/products/" + productId + "/reviews")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("rating", 5, "comment", "Excelente"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Un usuario autenticado puede publicar una reseña y aparece en el listado")
    void publicarConTokenFuncionaYApareceEnLaLista() throws Exception {
        String adminToken = tokenAdmin();
        Long productId = crearProducto(adminToken);
        String clienteToken = registrarYObtenerToken("cliente.review@test.cl");

        mockMvc.perform(post("/api/products/" + productId + "/reviews")
                        .header("Authorization", "Bearer " + clienteToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("rating", 4, "comment", "Muy bueno"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rating").value(4))
                .andExpect(jsonPath("$.authorName").value("Test Usuario"));

        mockMvc.perform(get("/api/products/" + productId + "/reviews"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].comment").value("Muy bueno"));

        // El promedio del producto también debe reflejar la nueva reseña.
        mockMvc.perform(get("/api/products/" + productId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.averageRating").value(4.0))
                .andExpect(jsonPath("$.reviewCount").value(1));
    }

    @Test
    @DisplayName("Un rating fuera de 1-5 se rechaza con 400")
    void ratingFueraDeRangoDevuelve400() throws Exception {
        String adminToken = tokenAdmin();
        Long productId = crearProducto(adminToken);
        String clienteToken = registrarYObtenerToken("cliente.rating.malo@test.cl");

        mockMvc.perform(post("/api/products/" + productId + "/reviews")
                        .header("Authorization", "Bearer " + clienteToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("rating", 7, "comment", "Fuera de rango"))))
                .andExpect(status().isBadRequest());
    }
}
