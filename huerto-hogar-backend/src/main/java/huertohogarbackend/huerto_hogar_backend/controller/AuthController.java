// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/controller/AuthController.java
package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.config.OpenApiConfig;
import huertohogarbackend.huerto_hogar_backend.dto.AuthResponse;
import huertohogarbackend.huerto_hogar_backend.dto.ForgotPasswordRequest;
import huertohogarbackend.huerto_hogar_backend.dto.LoginRequest;
import huertohogarbackend.huerto_hogar_backend.dto.RegisterRequest;
import huertohogarbackend.huerto_hogar_backend.dto.ResetPasswordRequest;
import huertohogarbackend.huerto_hogar_backend.dto.UpdateUserRequest;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.security.JwtService;
import huertohogarbackend.huerto_hogar_backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@Tag(name = "Autenticación", description = "Registro, login y gestión de la cuenta propia. Los endpoints de sesión (login/registro/recuperación) son públicos; ver/editar el perfil requiere token.")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    @Operation(
            summary = "Registrar un nuevo usuario",
            description = """
                    Crea la cuenta y devuelve de una vez el token JWT (no hace falta loguearse después).
                    El email se normaliza a minúsculas (dos cuentas no pueden diferir solo en mayúsculas). \
                    Si el email coincide con la variable de entorno ADMIN_EMAIL, la cuenta se crea con rol \
                    ADMIN automáticamente — eso solo puede pasar una vez, porque el email es único."""
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Cuenta creada; el body incluye el usuario y su token"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos (email mal formado, contraseña débil, teléfono con formato incorrecto, email ya registrado, etc.), mensaje como texto plano")
    })
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
    @Operation(
            summary = "Iniciar sesión",
            description = "Devuelve un token JWT válido por 8 horas. El email no distingue mayúsculas/minúsculas."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Credenciales correctas; el body incluye el usuario y su token"),
            @ApiResponse(responseCode = "401", description = "Email o contraseña incorrectos — mensaje genérico a propósito, no revela cuál de los dos falló")
    })
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
    @Operation(
            summary = "Obtener los datos vigentes del usuario autenticado",
            description = "Útil para refrescar datos que cambian del lado del servidor sin que el cliente se entere (ej. puntos de fidelidad tras completar un pedido)."
    )
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Datos actuales del usuario"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido"),
            @ApiResponse(responseCode = "404", description = "El usuario del token ya no existe")
    })
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
    @Operation(
            summary = "Actualizar el perfil del usuario autenticado",
            description = "No incluye email ni contraseña (no se cambian desde este formulario). Solo se puede editar el propio perfil: el id de la URL debe coincidir con el dueño del token, aunque tengas otro id a mano."
    )
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil actualizado"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos (mismas reglas que el registro, sin email ni contraseña)"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido"),
            @ApiResponse(responseCode = "403", description = "El id de la URL no es el del usuario del token")
    })
    public ResponseEntity<?> updateUserProfile(
            @Parameter(description = "Id del usuario a editar — debe ser el mismo que el del token") @PathVariable Long userId,
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

    /**
     * Solicita un código de recuperación de contraseña por correo.
     *
     * Responde siempre el mismo mensaje genérico, exista o no ese email: así
     * nadie puede usar este endpoint para averiguar qué correos están
     * registrados (mismo criterio que el login).
     */
    @PostMapping("/forgot-password")
    @Operation(
            summary = "Solicitar un código de recuperación de contraseña por correo",
            description = """
                    Genera un código de 6 dígitos (válido 15 minutos, se invalida tras 5 intentos \
                    fallidos) y lo envía por correo con diseño de marca. Siempre responde 200 con el \
                    mismo mensaje, exista o no la cuenta — no revela qué emails están registrados."""
    )
    @ApiResponse(responseCode = "200", description = "Mensaje genérico; revisa el correo para ver si llegó el código")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        authService.solicitarRecuperacion(request.getEmail());
        return ResponseEntity.ok("Si el correo está registrado, te enviamos un código de recuperación.");
    }

    @PostMapping("/reset-password")
    @Operation(
            summary = "Restablecer la contraseña usando el código enviado por correo",
            description = "Necesita el email junto con el código (el código de 6 dígitos por sí solo no es único entre usuarios). El código se consume: no sirve una segunda vez."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contraseña actualizada"),
            @ApiResponse(responseCode = "400", description = "Código inválido/expirado/ya usado, demasiados intentos fallidos, o contraseña nueva débil — mensaje como texto plano")
    })
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.restablecerContrasena(request.getEmail(), request.getCode(), request.getNewPassword());
            return ResponseEntity.ok("Contraseña actualizada con éxito.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
