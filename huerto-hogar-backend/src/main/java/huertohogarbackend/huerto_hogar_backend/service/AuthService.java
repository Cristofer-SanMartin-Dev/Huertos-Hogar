// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/service/AuthService.java
package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.dto.RegisterRequest;
import huertohogarbackend.huerto_hogar_backend.dto.UpdateUserRequest;
import huertohogarbackend.huerto_hogar_backend.model.PasswordResetToken;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.PasswordResetTokenRepository;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;
// FIX: Importa la excepción que se usará en 'updateUser'
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    private static final long RESET_TOKEN_VALIDEZ_MINUTOS = 60;

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    // Al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$");

    // Letras (con tildes/ñ) y espacios únicamente, sin números ni símbolos.
    private static final Pattern NOMBRE_PATTERN =
            Pattern.compile("^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$");

    // Solo dígitos, con un '+' opcional al inicio (formato internacional).
    private static final Pattern TELEFONO_PATTERN = Pattern.compile("^\\+?\\d{8,15}$");

    // --- Validadores de campo, reutilizados por el registro y la edición de perfil ---

    private void validarNombre(String valor, String etiqueta) {
        if (valor == null || !NOMBRE_PATTERN.matcher(valor.trim()).matches()) {
            throw new RuntimeException(etiqueta + " debe tener solo letras y al menos 2 caracteres.");
        }
    }

    private void validarCalle(String valor) {
        if (valor == null || valor.trim().length() < 3) {
            throw new RuntimeException("La calle debe tener al menos 3 caracteres.");
        }
    }

    private void validarNoVacio(String valor, String mensaje) {
        if (valor == null || valor.trim().isEmpty()) {
            throw new RuntimeException(mensaje);
        }
    }

    private void validarTelefono(String valor) {
        if (valor == null || !TELEFONO_PATTERN.matcher(valor.trim()).matches()) {
            throw new RuntimeException("El número de contacto debe tener entre 8 y 15 dígitos.");
        }
    }

    /**
     * Valida los campos del registro antes de crear la cuenta.
     *
     * Se hace aquí (no solo en el frontend) porque cualquiera puede llamar a
     * la API directamente sin pasar por el formulario: la validación real
     * vive en el servidor, la del cliente es solo para dar feedback rápido.
     */
    private void validarRegistro(RegisterRequest r) {
        validarNombre(r.getNombre(), "El nombre");
        validarNombre(r.getApellidos(), "Los apellidos");
        if (r.getEmail() == null || !EMAIL_PATTERN.matcher(r.getEmail().trim()).matches()) {
            throw new RuntimeException("El correo electrónico no tiene un formato válido.");
        }
        if (r.getPassword() == null || !PASSWORD_PATTERN.matcher(r.getPassword()).matches()) {
            throw new RuntimeException(
                    "La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y símbolo.");
        }
        validarCalle(r.getCalle());
        validarNoVacio(r.getRegion(), "La región es obligatoria.");
        validarNoVacio(r.getComuna(), "La comuna es obligatoria.");
        validarTelefono(r.getTelefono());
    }

    /**
     * Valida los campos editables del perfil. Mismas reglas que el registro,
     * salvo que aquí no hay email ni contraseña (ese DTO no los incluye a
     * propósito: no se pueden cambiar desde este formulario).
     */
    private void validarActualizacionPerfil(UpdateUserRequest r) {
        validarNombre(r.getNombre(), "El nombre");
        validarNombre(r.getApellidos(), "Los apellidos");
        validarCalle(r.getCalle());
        validarNoVacio(r.getRegion(), "La región es obligatoria.");
        validarNoVacio(r.getComuna(), "La comuna es obligatoria.");
        validarTelefono(r.getTelefono());
    }

    // FIX: El método DEBE devolver 'User' (Arregla el error de la línea 25)
    public User registerUser(RegisterRequest registerRequest) {

        validarRegistro(registerRequest);

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: El email ya está en uso.");
        }

        User newUser = new User();
        newUser.setNombre(registerRequest.getNombre());
        newUser.setApellidos(registerRequest.getApellidos());
        newUser.setEmail(registerRequest.getEmail());

        // FIX: Usamos el passwordEncoder (Arregla la advertencia "is not used")
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        newUser.setCalle(registerRequest.getCalle());
        newUser.setRegion(registerRequest.getRegion());
        newUser.setComuna(registerRequest.getComuna());
        newUser.setTelefono(registerRequest.getTelefono());

        // La cuenta de administración se define por configuración, no hardcodeada.
        // Solo puede reclamarse una vez, porque el email es único en la tabla.
        if (adminEmail.equalsIgnoreCase(registerRequest.getEmail())) {
            newUser.setRole("ADMIN");
        } else {
            newUser.setRole("CUSTOMER");
        }

        return userRepository.save(newUser);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
    }

    // FIX: El método DEBE devolver 'Optional<User>' (Arregla el error de la línea 30)
    public Optional<User> loginUser(String email, String rawPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // FIX: Usamos passwordEncoder.matches() (Arregla la advertencia "is not used")
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return userOptional;
            }
        }

        return Optional.empty();
    }

    /**
     * Actualiza el perfil de un usuario.
     *
     * @param userId          id que viene en la URL
     * @param requesterEmail  email extraído del token JWT de quien hace la petición
     *
     * Regla de autorización: un usuario solo puede modificar su propio perfil.
     * Se comprueba aquí, en el servicio, para que la regla se cumpla venga la
     * llamada de donde venga y no dependa solo de la configuración de rutas.
     */
    public User updateUser(Long userId, UpdateUserRequest updateUserRequest, String requesterEmail) {
        User userToUpdate = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con id: " + userId));

        if (!userToUpdate.getEmail().equalsIgnoreCase(requesterEmail)) {
            throw new AccessDeniedException("No puedes modificar el perfil de otro usuario.");
        }

        validarActualizacionPerfil(updateUserRequest);

        userToUpdate.setNombre(updateUserRequest.getNombre());
        userToUpdate.setApellidos(updateUserRequest.getApellidos());
        userToUpdate.setCalle(updateUserRequest.getCalle());
        userToUpdate.setRegion(updateUserRequest.getRegion());
        userToUpdate.setComuna(updateUserRequest.getComuna());
        userToUpdate.setTelefono(updateUserRequest.getTelefono());

        return userRepository.save(userToUpdate);
    }

    /**
     * Genera un token de recuperación y envía el correo con el enlace.
     *
     * Si el email no está registrado, no hace nada y no lanza error: el
     * llamador (el controller) siempre responde el mismo mensaje genérico,
     * para no revelar si una cuenta existe o no (mismo criterio que el login).
     */
    public void solicitarRecuperacion(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return;
        }
        User user = userOptional.get();

        // Solo un token vigente por usuario: pedir uno nuevo invalida el anterior.
        passwordResetTokenRepository.deleteByUser(user);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(UUID.randomUUID().toString());
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(RESET_TOKEN_VALIDEZ_MINUTOS));
        passwordResetTokenRepository.save(resetToken);

        String resetLink = frontendUrl + "/restablecer-contrasena?token=" + resetToken.getToken();
        // EmailService ya atrapa y loguea sus propios errores de envío: nunca
        // debe impedir la respuesta genérica de éxito que da el controller.
        emailService.enviarCorreoRecuperacion(user.getEmail(), user.getNombre(), resetLink);
    }

    /**
     * Aplica una nueva contraseña usando un token de recuperación válido.
     * El token se consume (se borra) tanto si funciona como si expiró, para
     * que no quede utilizable una segunda vez ni acumulando basura vencida.
     */
    public void restablecerContrasena(String token, String newPassword) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("El enlace de recuperación no es válido."));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new RuntimeException("El enlace de recuperación expiró. Solicita uno nuevo.");
        }

        if (newPassword == null || !PASSWORD_PATTERN.matcher(newPassword).matches()) {
            throw new RuntimeException(
                    "La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y símbolo.");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);
    }
}
