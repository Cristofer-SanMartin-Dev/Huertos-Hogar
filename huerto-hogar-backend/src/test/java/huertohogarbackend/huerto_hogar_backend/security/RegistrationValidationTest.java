package huertohogarbackend.huerto_hogar_backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.web.servlet.MockMvc;

/**
 * El registro se valida en el servidor, no solo en el formulario: cualquiera
 * puede llamar a la API directamente. Cada caso cambia un único campo válido
 * por uno inválido y confirma que el registro se rechace con 400.
 */
@SpringBootTest
@AutoConfigureMockMvc
class RegistrationValidationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private Map<String, String> cuerpoValido(String email) {
        Map<String, String> body = new HashMap<>();
        body.put("nombre", "Ana");
        body.put("apellidos", "Perez");
        body.put("email", email);
        body.put("password", "Password123!");
        body.put("calle", "Calle 123");
        body.put("region", "Metropolitana");
        body.put("comuna", "Santiago");
        body.put("telefono", "12345678");
        return body;
    }

    private void esperarRechazo(Map<String, String> body) throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Una contraseña sin símbolo se rechaza")
    void contrasenaSinSimboloSeRechaza() throws Exception {
        Map<String, String> body = cuerpoValido("sin.simbolo@test.cl");
        body.put("password", "Password123");
        esperarRechazo(body);
    }

    @Test
    @DisplayName("Una contraseña de menos de 8 caracteres se rechaza")
    void contrasenaCortaSeRechaza() throws Exception {
        Map<String, String> body = cuerpoValido("corta@test.cl");
        body.put("password", "Ab1!");
        esperarRechazo(body);
    }

    @Test
    @DisplayName("Una contraseña sin mayúscula se rechaza")
    void contrasenaSinMayusculaSeRechaza() throws Exception {
        Map<String, String> body = cuerpoValido("sin.mayuscula@test.cl");
        body.put("password", "password123!");
        esperarRechazo(body);
    }

    @Test
    @DisplayName("Un nombre con números se rechaza")
    void nombreConNumerosSeRechaza() throws Exception {
        Map<String, String> body = cuerpoValido("nombre.numeros@test.cl");
        body.put("nombre", "Ana123");
        esperarRechazo(body);
    }

    @Test
    @DisplayName("Un correo con formato inválido se rechaza")
    void correoInvalidoSeRechaza() throws Exception {
        Map<String, String> body = cuerpoValido("no-es-un-correo");
        esperarRechazo(body);
    }

    @Test
    @DisplayName("Un teléfono con letras se rechaza")
    void telefonoInvalidoSeRechaza() throws Exception {
        Map<String, String> body = cuerpoValido("telefono.malo@test.cl");
        body.put("telefono", "no-es-un-telefono");
        esperarRechazo(body);
    }

    @Test
    @DisplayName("Un registro con todos los campos válidos se acepta")
    void registroValidoSeAcepta() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(cuerpoValido("valido@test.cl"))))
                .andExpect(status().isOk());
    }
}
