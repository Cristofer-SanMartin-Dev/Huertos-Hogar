// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/service/AuthService.java
package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.dto.RegisterRequest;
import huertohogarbackend.huerto_hogar_backend.dto.UpdateUserRequest;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.regex.Pattern;
// FIX: Importa la excepción que se usará en 'updateUser'
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

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

    /**
     * Valida los campos del registro antes de crear la cuenta.
     *
     * Se hace aquí (no solo en el frontend) porque cualquiera puede llamar a
     * la API directamente sin pasar por el formulario: la validación real
     * vive en el servidor, la del cliente es solo para dar feedback rápido.
     */
    private void validarRegistro(RegisterRequest r) {
        if (r.getNombre() == null || !NOMBRE_PATTERN.matcher(r.getNombre().trim()).matches()) {
            throw new RuntimeException("El nombre debe tener solo letras y al menos 2 caracteres.");
        }
        if (r.getApellidos() == null || !NOMBRE_PATTERN.matcher(r.getApellidos().trim()).matches()) {
            throw new RuntimeException("Los apellidos deben tener solo letras y al menos 2 caracteres.");
        }
        if (r.getEmail() == null || !EMAIL_PATTERN.matcher(r.getEmail().trim()).matches()) {
            throw new RuntimeException("El correo electrónico no tiene un formato válido.");
        }
        if (r.getPassword() == null || !PASSWORD_PATTERN.matcher(r.getPassword()).matches()) {
            throw new RuntimeException(
                    "La contraseña debe tener al menos 8 caracteres, con mayúscula, minúscula, número y símbolo.");
        }
        if (r.getCalle() == null || r.getCalle().trim().length() < 3) {
            throw new RuntimeException("La calle debe tener al menos 3 caracteres.");
        }
        if (r.getRegion() == null || r.getRegion().trim().isEmpty()) {
            throw new RuntimeException("La región es obligatoria.");
        }
        if (r.getComuna() == null || r.getComuna().trim().isEmpty()) {
            throw new RuntimeException("La comuna es obligatoria.");
        }
        if (r.getTelefono() == null || !TELEFONO_PATTERN.matcher(r.getTelefono().trim()).matches()) {
            throw new RuntimeException("El número de contacto debe tener entre 8 y 15 dígitos.");
        }
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

        userToUpdate.setNombre(updateUserRequest.getNombre());
        userToUpdate.setApellidos(updateUserRequest.getApellidos());
        userToUpdate.setCalle(updateUserRequest.getCalle());
        userToUpdate.setRegion(updateUserRequest.getRegion());
        userToUpdate.setComuna(updateUserRequest.getComuna());
        userToUpdate.setTelefono(updateUserRequest.getTelefono());

        return userRepository.save(userToUpdate);
    }
}