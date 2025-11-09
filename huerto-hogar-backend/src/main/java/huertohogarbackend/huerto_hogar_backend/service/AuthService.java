// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/service/AuthService.java
package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.dto.RegisterRequest;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
// Importa el PasswordEncoder (de tu SecurityConfig)
import org.springframework.security.crypto.password.PasswordEncoder; 

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    // Inyecta el PasswordEncoder que (debes) tener definido en SecurityConfig
    @Autowired
    private PasswordEncoder passwordEncoder; 

    // --- MÉTODO REGISTER CORREGIDO ---
    // Acepta el DTO 'RegisterRequest'
    public User registerUser(RegisterRequest registerRequest) {
        
        // 1. Validar si el email ya existe (usando el método del repositorio)
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: El email ya está en uso.");
        }

        // 2. Crear la entidad User nueva
        User newUser = new User();
        newUser.setName(registerRequest.getName());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setAddress(registerRequest.getAddress()); // <-- Guardamos la dirección
        
        // 3. IMPORTANTE: Codificar la contraseña antes de guardarla
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        // 4. Guardar en la base de datos
        return userRepository.save(newUser);
    }

    // --- MÉTODO LOGIN CORREGIDO (para usar el Encoder) ---
    public Optional<User> loginUser(String email, String rawPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Compara la contraseña de texto plano con la encriptada en la BD
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return userOptional; // La contraseña es correcta
            }
        }
        
        return Optional.empty(); // Email no encontrado o contraseña incorrecta
    }
}