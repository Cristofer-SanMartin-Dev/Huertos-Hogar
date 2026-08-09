package huertohogarbackend.huerto_hogar_backend.order;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProductRepository productRepository;

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

    private JsonNode registrarCliente(String email) throws Exception {
        Map<String, String> body = Map.of(
                "nombre", "Cliente", "apellidos", "Test", "email", email,
                "password", "Password123!", "calle", "Calle 1",
                "region", "Metropolitana", "comuna", "Santiago", "telefono", "12345678"
        );
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    /** Crea un producto real con stock conocido, vía el endpoint admin. */
    private Long crearProducto(String adminToken, String nombre, double precio, int stock) throws Exception {
        MockMultipartFile image = new MockMultipartFile("image", "test.png", "image/png", new byte[]{1, 2, 3});
        MvcResult result = mockMvc.perform(multipart("/api/products")
                        .file(image)
                        .param("name", nombre)
                        .param("description", "Para pruebas de pedidos")
                        .param("price", String.valueOf(precio))
                        .param("stock", String.valueOf(stock))
                        .param("category", "Frutas Frescas")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).get("id").asLong();
    }

    private String crearPedidoBody(Long productId, int cantidad) throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "items", List.of(Map.of("productId", productId, "cantidad", cantidad)),
                "calle", "Calle Envio 1", "region", "Metropolitana", "comuna", "Santiago"
        ));
    }

    @Test
    @DisplayName("Crear un pedido con stock válido calcula el total en el servidor y descuenta stock")
    void crearPedidoConStockValido() throws Exception {
        String adminToken = tokenAdmin();
        Long productId = crearProducto(adminToken, "Naranjas", 1000.0, 10);
        JsonNode cliente = registrarCliente("cliente.pedido1@test.cl");

        mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + cliente.get("token").asText())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(crearPedidoBody(productId, 3)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(3000.0))
                .andExpect(jsonPath("$.estado").value("PENDIENTE"))
                .andExpect(jsonPath("$.items[0].subtotal").value(3000.0));

        assertThat(productRepository.findById(productId).get().getStock()).isEqualTo(7);
    }

    @Test
    @DisplayName("Pedir más cantidad que el stock disponible responde 400 y no cambia el stock")
    void crearPedidoConStockInsuficienteDevuelve400() throws Exception {
        String adminToken = tokenAdmin();
        Long productId = crearProducto(adminToken, "Espinacas", 700.0, 2);
        JsonNode cliente = registrarCliente("cliente.pedido2@test.cl");

        mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + cliente.get("token").asText())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(crearPedidoBody(productId, 5)))
                .andExpect(status().isBadRequest());

        assertThat(productRepository.findById(productId).get().getStock()).isEqualTo(2);
    }

    @Test
    @DisplayName("Solo el dueño del pedido o un admin pueden verlo; otro cliente recibe 403")
    void verPedidoAjenoDevuelve403() throws Exception {
        String adminToken = tokenAdmin();
        Long productId = crearProducto(adminToken, "Miel", 5000.0, 20);
        JsonNode dueño = registrarCliente("dueño.pedido@test.cl");
        JsonNode otro = registrarCliente("otro.cliente@test.cl");

        MvcResult creado = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + dueño.get("token").asText())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(crearPedidoBody(productId, 1)))
                .andExpect(status().isOk())
                .andReturn();
        long orderId = objectMapper.readTree(creado.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(get("/api/orders/" + orderId)
                        .header("Authorization", "Bearer " + dueño.get("token").asText()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/orders/" + orderId)
                        .header("Authorization", "Bearer " + otro.get("token").asText()))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/orders/" + orderId)
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/orders/" + orderId))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Solo un admin puede cambiar el estado de un pedido")
    void cambiarEstadoSoloAdmin() throws Exception {
        String adminToken = tokenAdmin();
        Long productId = crearProducto(adminToken, "Quinua", 4000.0, 15);
        JsonNode cliente = registrarCliente("cliente.pedido3@test.cl");

        MvcResult creado = mockMvc.perform(post("/api/orders")
                        .header("Authorization", "Bearer " + cliente.get("token").asText())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(crearPedidoBody(productId, 1)))
                .andExpect(status().isOk())
                .andReturn();
        long orderId = objectMapper.readTree(creado.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(put("/api/orders/" + orderId + "/estado")
                        .header("Authorization", "Bearer " + cliente.get("token").asText())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("estado", "ENVIADO"))))
                .andExpect(status().isForbidden());

        mockMvc.perform(put("/api/orders/" + orderId + "/estado")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("estado", "ENVIADO"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.estado").value("ENVIADO"));
    }
}
