// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/controller/AuthController.java
package huertohogarbackend.huerto_hogar_backend.controller;

// --- IMPORTACIONES MODIFICADAS ---
import huertohogarbackend.huerto_hogar_backend.dto.LoginRequest;
import huertohogarbackend.huerto_hogar_backend.dto.RegisterRequest; // <--- 1. Importa el DTO nuevo
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Optional; 

@RestController
@RequestMapping("/api/auth") 
@Tag(name = "Autenticación", description = "API para el registro e inicio de sesión de usuarios")
public class AuthController {

    @Autowired
    private AuthService authService;

    // --- 2. MÉTODO REGISTER CORREGIDO ---
    @PostMapping("/register")
    @Operation(summary = "Registrar un nuevo usuario")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        // @RequestBody ahora usa el DTO (RegisterRequest), no la Entidad (User)
        try {
            // Pasamos el DTO al servicio
            User registeredUser = authService.registerUser(registerRequest); 
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            // Esto capturará el error "Email ya en uso" del servicio
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- Tu método de Login (sin cambios, ya estaba bien) ---
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión con email y contraseña")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = authService.loginUser(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        );

        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        } else {
            return ResponseEntity.status(401).body("Error: Email o contraseña incorrectos.");
        }
    }
}