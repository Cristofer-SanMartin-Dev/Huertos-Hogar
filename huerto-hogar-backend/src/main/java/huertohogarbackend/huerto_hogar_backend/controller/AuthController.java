// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/controller/AuthController.java
package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.dto.AuthResponse;
import huertohogarbackend.huerto_hogar_backend.dto.LoginRequest;
import huertohogarbackend.huerto_hogar_backend.dto.RegisterRequest;
import huertohogarbackend.huerto_hogar_backend.dto.UpdateUserRequest;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.security.JwtService;
import huertohogarbackend.huerto_hogar_backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "API para el registro e inicio de sesión de usuarios")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    @Operation(summary = "Registrar un nuevo usuario y devolver su token de acceso")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User registeredUser = authService.registerUser(registerRequest);
            String token = jwtService.generateToken(registeredUser);
            return ResponseEntity.ok(AuthResponse.from(registeredUser, token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión y obtener un token JWT")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> userOptional = authService.loginUser(
            loginRequest.getEmail(),
            loginRequest.getPassword()
        );

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            String token = jwtService.generateToken(user);
            return ResponseEntity.ok(AuthResponse.from(user, token));
        }

        // Mensaje genérico a propósito: no revelamos si el email existe o no.
        return ResponseEntity.status(401).body("Error: Email o contraseña incorrectos.");
    }

    /**
     * Devuelve los datos vigentes del usuario autenticado.
     *
     * El frontend guarda una copia del usuario en localStorage al iniciar
     * sesión; sin este endpoint, campos que cambian por acciones del servidor
     * (como los puntos de fidelidad al completar un pedido) quedarían
     * desactualizados hasta el próximo login.
     */
    @GetMapping("/me")
    @Operation(summary = "Obtener los datos vigentes del usuario autenticado")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Debes iniciar sesión.");
        }
        try {
            User user = authService.getByEmail(currentUser.getUsername());
            return ResponseEntity.ok(AuthResponse.from(user));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /**
     * Actualiza el perfil.
     *
     * La ruta exige token válido (SecurityConfig) y, además, el servicio
     * comprueba que el id de la URL pertenezca al usuario del token: nadie
     * puede editar el perfil de otra persona cambiando el id.
     */
    @PutMapping("/profile/{userId}")
    @Operation(summary = "Actualizar el perfil del usuario autenticado")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable Long userId,
            @RequestBody UpdateUserRequest updateUserRequest,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(401).body("Debes iniciar sesión para editar tu perfil.");
        }

        try {
            User updatedUser = authService.updateUser(
                    userId, updateUserRequest, currentUser.getUsername());
            return ResponseEntity.ok(AuthResponse.from(updatedUser));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (RuntimeException e) {
            // Incluye los errores de validación (ej. "El nombre debe tener...").
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
