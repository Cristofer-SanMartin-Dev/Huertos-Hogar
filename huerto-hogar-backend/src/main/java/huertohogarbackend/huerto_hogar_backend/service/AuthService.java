// TUTOR: El nombre del paquete coincide con tu estructura de carpetas
package huertohogarbackend.huerto_hogar_backend.service;

// Importamos el Modelo de Usuario y el Repositorio de Usuario
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;

// Importaciones de Spring
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// Importamos el ENCRIPTADOR de contraseñas que configuramos en SecurityConfig
import org.springframework.security.crypto.password.PasswordEncoder;

// --- NUEVA IMPORTACIÓN ---
// Importamos Optional, que usaremos para devolver el usuario si se encuentra
import java.util.Optional;
// --- FIN NUEVA IMPORTACIÓN ---

/**
 * TUTOR: Esta clase es el Servicio de Autenticación.
 * [cite_start]Sigue la misma estructura que el 'BookService' de la guía [cite: 798-825].
 * Su lógica principal será el registro de nuevos usuarios.
 */
@Service // @Service: Le dice a Spring que esta clase es un Servicio [cite: 809-810].
public class AuthService {

    // @Autowired: Spring inyecta una instancia del Repositorio de Usuarios
    @Autowired
    private UserRepository userRepository;

    // @Autowired: Spring inyecta el PasswordEncoder que creamos en SecurityConfig
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * TUTOR: Este es el método principal para registrar un nuevo usuario.
     * Recibe un objeto 'User' con los datos (nombre, email, contraseña en texto plano).
     */
    public User registerUser(User user) {
        
        // 1. VERIFICAR SI EL USUARIO YA EXISTE
        // Usamos el método findByEmail que creamos en el Repositorio.
        if(userRepository.findByEmail(user.getEmail()).isPresent()) {
            // Si el usuario ya existe, lanzamos una excepción (o podríamos devolver null).
            throw new RuntimeException("Error: El correo electrónico ya está registrado.");
        }

        // 2. ENCRIPTAR LA CONTRASEÑA
        // ¡Este es el paso de seguridad MÁS IMPORTANTE!
        // Obtenemos la contraseña en texto plano (ej: "12345")
        // y la reemplazamos con su versión encriptada (ej: "$2a$10$...")
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3. GUARDAR EL USUARIO
        // Guardamos el objeto User (ahora con la contraseña encriptada)
        // en la base de datos, usando el método .save() [cite: 817-819].
        return userRepository.save(user);
    }

    // --- NUEVO MÉTODO AÑADIDO ---
    /**
     * TUTOR: Este es el nuevo método para el login.
     * Recibe el email y la contraseña en texto plano desde el controlador.
     */
    public Optional<User> loginUser(String email, String password) {
        
        // Paso 1: Buscar al usuario por su email usando el método del repositorio.
        Optional<User> optionalUser = userRepository.findByEmail(email);

        // Paso 2: Si el 'Optional' está vacío (no se encontró el usuario),
        // devolvemos el Optional vacío. El login falla.
        if (optionalUser.isEmpty()) {
            return Optional.empty();
        }

        // Paso 3: Si el usuario existe, lo extraemos del Optional.
        User user = optionalUser.get();

        // Paso 4: ¡LA LÓGICA DE VERIFICACIÓN!
        // Usamos el 'passwordEncoder' para comparar la contraseña en texto plano (password)
        // con la contraseña encriptada (hash) guardada en la BD (user.getPassword()).
        // .matches() es la función de BCrypt que hace esta comparación segura.
        if (passwordEncoder.matches(password, user.getPassword())) {
            // Paso 5: Si las contraseñas coinciden, devolvemos el Optional con el usuario. El login es exitoso.
            return optionalUser;
        }

        // Paso 6: Si las contraseñas no coinciden, devolvemos un Optional vacío. El login falla.
        return Optional.empty();
    }
    // --- FIN NUEVO MÉTODO ---
}