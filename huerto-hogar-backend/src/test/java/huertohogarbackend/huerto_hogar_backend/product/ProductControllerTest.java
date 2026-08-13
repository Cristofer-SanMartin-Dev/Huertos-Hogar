package huertohogarbackend.huerto_hogar_backend.product;

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

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ProductControllerTest {

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

    private JsonNode crearProducto(String adminToken, String nombre, int stock) throws Exception {
        MockMultipartFile image = new MockMultipartFile("image", "test.png", "image/png", new byte[]{1, 2, 3});
        MvcResult result = mockMvc.perform(multipart("/api/products")
                        .file(image)
                        .param("name", nombre)
                        .param("description", "Producto de prueba")
                        .param("price", "1000")
                        .param("stock", String.valueOf(stock))
                        .param("category", "Frutas Frescas")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    @Test
    @DisplayName("Un producto creado en 'Frutas Frescas' recibe un código con prefijo FR")
    void crearProductoGeneraCodigoConPrefijoDeSuCategoria() throws Exception {
        String adminToken = tokenAdmin();
        JsonNode producto = crearProducto(adminToken, "Manzana código", 10);

        assertThat(producto.get("code").asText()).matches("FR\\d{3}");
    }

    @Test
    @DisplayName("Dos productos seguidos en la misma categoría reciben códigos distintos")
    void codigosNoSeRepiten() throws Exception {
        String adminToken = tokenAdmin();
        String code1 = crearProducto(adminToken, "Pera código 1", 5).get("code").asText();
        String code2 = crearProducto(adminToken, "Pera código 2", 5).get("code").asText();

        assertThat(code1).isNotEqualTo(code2);
    }

    @Test
    @DisplayName("Reponer stock suma a la cantidad existente, no la reemplaza")
    void reponerStockSumaAlStockActual() throws Exception {
        String adminToken = tokenAdmin();
        JsonNode producto = crearProducto(adminToken, "Naranja stock", 10);
        Long id = producto.get("id").asLong();

        MvcResult result = mockMvc.perform(post("/api/products/" + id + "/stock")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("cantidad", 15))))
                .andExpect(status().isOk())
                .andReturn();

        int nuevoStock = objectMapper.readTree(result.getResponse().getContentAsString()).get("stock").asInt();
        assertThat(nuevoStock).isEqualTo(25);
    }

    @Test
    @DisplayName("Reponer stock con cantidad negativa o cero se rechaza")
    void reponerStockConCantidadInvalidaDevuelve400() throws Exception {
        String adminToken = tokenAdmin();
        JsonNode producto = crearProducto(adminToken, "Uva stock inválido", 10);
        Long id = producto.get("id").asLong();

        mockMvc.perform(post("/api/products/" + id + "/stock")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("cantidad", 0))))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Un cliente normal no puede reponer stock")
    void reponerStockSinRolAdminDevuelve403() throws Exception {
        String adminToken = tokenAdmin();
        JsonNode producto = crearProducto(adminToken, "Kiwi stock", 10);
        Long id = producto.get("id").asLong();

        Map<String, String> body = Map.of(
                "nombre", "Cliente", "apellidos", "Test", "email", "cliente.stock@test.cl",
                "password", "Password123!", "calle", "Calle 1",
                "region", "Metropolitana", "comuna", "Santiago", "telefono", "912345678"
        );
        MvcResult registro = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();
        String clienteToken = objectMapper.readTree(registro.getResponse().getContentAsString()).get("token").asText();

        mockMvc.perform(post("/api/products/" + id + "/stock")
                        .header("Authorization", "Bearer " + clienteToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("cantidad", 5))))
                .andExpect(status().isForbidden());
    }
}
