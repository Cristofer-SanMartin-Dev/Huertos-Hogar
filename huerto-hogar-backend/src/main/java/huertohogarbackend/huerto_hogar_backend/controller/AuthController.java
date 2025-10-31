// TUTOR: El nombre del paquete coincide con tu estructura de carpetas
package huertohogarbackend.huerto_hogar_backend.controller;

// Importamos el Modelo de Usuario y el Servicio de Autenticación
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.service.AuthService;

// Importaciones de Spring
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
@RestController // @RestController: Indica que esta clase es un controlador REST[cite: 835].
@RequestMapping("/api/auth") // @RequestMapping: URL base para todos los endpoints de este controlador [cite: 839-843].
@Tag(name = "Autenticación", description = "API para el registro e inicio de sesión de usuarios") // @Tag: Título en Swagger [cite: 840-845].
public class AuthController {

    // Inyecta el servicio de autenticación
    @Autowired
    private AuthService authService;

    /**
     * TUTOR: Este es el endpoint para registrar un nuevo usuario.
     * Sigue la lógica del @PostMapping de la guía [cite: 859-867].
     */
    @PostMapping("/register") // @PostMapping: Mapea este método a peticiones HTTP POST a /api/auth/register
    @Operation(summary = "Registrar un nuevo usuario") // @Operation: Descripción en Swagger [cite: 848-855].
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        // @RequestBody: Convierte el JSON de la petición en un objeto User[cite: 864].
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

    // TUTOR: Aquí es donde añadiremos el endpoint @PostMapping("/login")
    // en un próximo commit, una vez que tengamos la lógica de login en el servicio.
}