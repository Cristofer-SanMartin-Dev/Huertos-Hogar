// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/controller/AuthController.java
package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.dto.LoginRequest;
import huertohogarbackend.huerto_hogar_backend.dto.RegisterRequest;
import huertohogarbackend.huerto_hogar_backend.dto.UpdateUserRequest;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Optional; 
// FIX: Importa la excepción que faltaba (Arregla el error de la línea 46)
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RestController
@RequestMapping("/api/auth") 
@Tag(name = "Autenticación", description = "API para el registro e inicio de sesión de usuarios")
public class AuthController {

    @Autowired
    private AuthService authService;

    // FIX: El método DEBE devolver 'ResponseEntity' (Arregla el error de la línea 26)
    @PostMapping("/register")
    @Operation(summary = "Registrar un nuevo usuario")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User registeredUser = authService.registerUser(registerRequest); 
            return ResponseEntity.ok(registeredUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // FIX: El método DEBE devolver 'ResponseEntity' (Arregla el error de la línea 32)
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

    @PutMapping("/profile/{userId}")
    @Operation(summary = "Actualizar el perfil de un usuario")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long userId, 
            @RequestBody UpdateUserRequest updateUserRequest) {
        
        try {
            User updatedUser = authService.updateUser(userId, updateUserRequest);
            return ResponseEntity.ok(updatedUser);
        } catch (UsernameNotFoundException e) { // <-- Ahora 'UsernameNotFoundException' es reconocida
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar el perfil.");
        }
    }
}