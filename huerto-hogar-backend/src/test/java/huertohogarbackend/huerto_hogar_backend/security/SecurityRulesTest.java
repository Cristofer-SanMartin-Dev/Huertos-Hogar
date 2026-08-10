package huertohogarbackend.huerto_hogar_backend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
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

/**
 * Pruebas de las reglas de autorización de la API.
 *
 * Verifican que la seguridad se cumpla en el servidor y no dependa de que el
 * frontend "esconda" botones: cada caso ataca directamente el endpoint.
 */
@SpringBootTest
@AutoConfigureMockMvc
class SecurityRulesTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    // --- Utilidades ---

    /** Registra un usuario y devuelve la respuesta (incluye id y token). */
    private JsonNode registrar(String email) throws Exception {
        Map<String, String> body = Map.of(
                "nombre", "Test",
                "apellidos", "Usuario",
                "email", email,
                "password", "Password123!",
                "calle", "Calle 123",
                "region", "Metropolitana",
                "comuna", "Santiago",
                "telefono", "12345678"
        );

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString());
    }

    private String bodyPerfil() throws Exception {
        return objectMapper.writeValueAsString(Map.of(
                "nombre", "NombreEditado",
                "apellidos", "ApellidoEditado",
                "calle", "Otra calle 456",
                "region", "Valparaíso",
                "comuna", "Viña del Mar"
        ));
    }

    // --- Autenticación ---

    @Test
    @DisplayName("El login devuelve un token JWT y nunca la contraseña")
    void loginDevuelveTokenYNoExponeContrasena() throws Exception {
        registrar("login.token@test.cl");

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "login.token@test.cl",
                                "password", "Password123!"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andReturn();

        String json = result.getResponse().getContentAsString();
        assertThat(json).doesNotContain("password");
        assertThat(json).doesNotContain("$2a$"); // prefijo de un hash BCrypt
    }

    @Test
    @DisplayName("Con contraseña incorrecta el login responde 401")
    void loginConContrasenaIncorrectaDevuelve401() throws Exception {
        registrar("clave.mala@test.cl");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "clave.mala@test.cl",
                                "password", "otraClave"))))
                .andExpect(status().isUnauthorized());
    }

    // --- Perfil: el fallo que se corrigió ---

    @Test
    @DisplayName("Editar un perfil sin token responde 401")
    void editarPerfilSinTokenDevuelve401() throws Exception {
        JsonNode usuario = registrar("sin.token@test.cl");

        mockMvc.perform(put("/api/auth/profile/" + usuario.get("id").asLong())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bodyPerfil()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Un usuario NO puede editar el perfil de otro aunque cambie el id de la URL")
    void editarPerfilAjenoDevuelve403() throws Exception {
        JsonNode victima = registrar("victima@test.cl");
        JsonNode atacante = registrar("atacante@test.cl");

        mockMvc.perform(put("/api/auth/profile/" + victima.get("id").asLong())
                        .header("Authorization", "Bearer " + atacante.get("token").asText())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bodyPerfil()))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/auth/me devuelve los datos vigentes del usuario autenticado")
    void meDevuelveDatosVigentes() throws Exception {
        JsonNode usuario = registrar("me.endpoint@test.cl");

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + usuario.get("token").asText()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("me.endpoint@test.cl"));

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Un usuario SÍ puede editar su propio perfil")
    void editarPerfilPropioFunciona() throws Exception {
        JsonNode usuario = registrar("propio@test.cl");

        mockMvc.perform(put("/api/auth/profile/" + usuario.get("id").asLong())
                        .header("Authorization", "Bearer " + usuario.get("token").asText())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bodyPerfil()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nombre").value("NombreEditado"));
    }

    @Test
    @DisplayName("Un token manipulado no da acceso")
    void tokenAlteradoDevuelve401() throws Exception {
        JsonNode usuario = registrar("token.falso@test.cl");
        String tokenAlterado = usuario.get("token").asText() + "abc";

        mockMvc.perform(put("/api/auth/profile/" + usuario.get("id").asLong())
                        .header("Authorization", "Bearer " + tokenAlterado)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(bodyPerfil()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Un token de una cuenta ya eliminada no rompe ni siquiera las rutas públicas")
    void tokenDeUsuarioEliminadoNoRompeRutasPublicas() throws Exception {
        JsonNode usuario = registrar("cuenta.a.eliminar@test.cl");
        String tokenHuerfano = usuario.get("token").asText();

        userRepository.deleteById(usuario.get("id").asLong());

        // Antes de este arreglo, un token de una cuenta borrada tumbaba con
        // 500 hasta las rutas públicas, porque el filtro no manejaba esta
        // excepción y el catálogo depende de que la petición pase igual.
        mockMvc.perform(get("/api/products").header("Authorization", "Bearer " + tokenHuerfano))
                .andExpect(status().isOk());
    }

    // --- Catálogo: lectura pública, escritura solo ADMIN ---

    @Test
    @DisplayName("El catálogo se puede leer sin iniciar sesión")
    void catalogoEsPublico() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Eliminar un producto sin token responde 401")
    void eliminarProductoSinTokenDevuelve401() throws Exception {
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Un cliente no puede eliminar productos del catálogo")
    void eliminarProductoComoClienteDevuelve403() throws Exception {
        JsonNode cliente = registrar("cliente.catalogo@test.cl");

        mockMvc.perform(delete("/api/products/1")
                        .header("Authorization", "Bearer " + cliente.get("token").asText()))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Un cliente no puede crear productos en el catálogo")
    void crearProductoComoClienteDevuelve403() throws Exception {
        JsonNode cliente = registrar("cliente.crear@test.cl");

        mockMvc.perform(multipart("/api/products")
                        .param("name", "Producto pirata")
                        .param("description", "No debería crearse")
                        .param("price", "1000")
                        .param("stock", "5")
                        .param("category", "Frutas")
                        .header("Authorization", "Bearer " + cliente.get("token").asText()))
                .andExpect(status().isForbidden());
    }
}
