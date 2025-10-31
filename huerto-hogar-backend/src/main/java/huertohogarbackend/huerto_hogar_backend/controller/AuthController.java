// TUTOR: El nombre del paquete coincide con tu estructura de carpetas
package huertohogarbackend.huerto_hogar_backend.controller;

// --- NUEVAS IMPORTACIONES ---
// Importa el nuevo DTO que recibe los datos del login
import huertohogarbackend.huerto_hogar_backend.dto.LoginRequest; 
// Importa ResponseEntity para poder devolver códigos de estado (ej: 401)
import org.springframework.http.ResponseEntity; 
// Importa Optional para manejar la respuesta del servicio
import java.util.Optional; 
// --- FIN NUEVAS IMPORTACIONES ---

// Importamos el Modelo de Usuario y el Servicio de Autenticación
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.service.AuthService;

// Importaciones de Spring
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Importaciones de Swagger (OpenAPI) para la documentación
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;


/**
 * TUTOR: Este es el Controlador para la Autenticación.
 * Manejará las peticiones de /register y, más adelante, /login.
 */
@RestController // @RestController: Indica que esta clase es un controlador REST.
@RequestMapping("/api/auth") // @RequestMapping: URL base para todos los endpoints de este controlador [cite: 839-843].
@Tag(name = "Autenticación", description = "API para el registro e inicio de sesión de usuarios") // @Tag: Título en Swagger [cite: 840-845].
public class AuthController {

    // Inyecta el servicio de autenticación
    @Autowired
    private AuthService authService;

    /**
     * TUTOR: Este es el endpoint para registrar un nuevo usuario.
     * [cite_start]Sigue la lógica del @PostMapping de la guía [cite: 859-867].
     */
    @PostMapping("/register") // @PostMapping: Mapea este método a peticiones HTTP POST a /api/auth/register
    @Operation(summary = "Registrar un nuevo usuario") // @Operation: Descripción en Swagger [cite: 848-855].
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // @RequestBody: Convierte el JSON de la petición en un objeto User.
        try {
            // Llama al servicio para registrar al usuario (que encriptará la contraseña)
            User registeredUser = authService.registerUser(user);
            // Si tiene éxito, devuelve un 200 OK con el usuario creado
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            // Si el servicio lanza una excepción (ej: "email ya existe"),
            // devolvemos un 400 Bad Request con el mensaje de error.
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- NUEVO ENDPOINT AÑADIDO ---
    /**
     * TUTOR: Este es el nuevo endpoint para el login.
     * Se mapea a peticiones POST en /api/auth/login.
     */
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión con email y contraseña")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        // @RequestBody toma el JSON del frontend (ej: { "email": "a@b.c", "password": "123" })
        // y lo convierte en nuestro objeto LoginRequest.java.

        // Llama al servicio de login con los datos del DTO.
        Optional<User> userOptional = authService.loginUser(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        );

        // Comprueba si el Optional que devolvió el servicio contiene un usuario.
        if (userOptional.isPresent()) {
            // Si .isPresent() es true, el login fue exitoso.
            // Devolvemos un 200 OK con el cuerpo del usuario encontrado.
            // (En un futuro real, aquí generaríamos y devolveríamos un Token JWT).
            return ResponseEntity.ok(userOptional.get());
        } else {
            // Si el Optional está vacío, el login falló (email o pass incorrectos).
            // Devolvemos un 401 Unauthorized (No autorizado) con un mensaje de error.
            return ResponseEntity.status(401).body("Error: Email o contraseña incorrectos.");
        }
    }
    // --- FIN NUEVO ENDPOINT ---
}