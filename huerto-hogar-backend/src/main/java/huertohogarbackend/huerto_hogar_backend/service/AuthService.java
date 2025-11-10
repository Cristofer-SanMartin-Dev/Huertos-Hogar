// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/service/AuthService.java
package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.dto.RegisterRequest;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; 

    public User registerUser(RegisterRequest registerRequest) {
        
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Error: El email ya está en uso.");
        }

        User newUser = new User();
        newUser.setNombre(registerRequest.getNombre());
        newUser.setApellidos(registerRequest.getApellidos());
        newUser.setEmail(registerRequest.getEmail());
        newUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        newUser.setCalle(registerRequest.getCalle());
        newUser.setRegion(registerRequest.getRegion());
        newUser.setComuna(registerRequest.getComuna());
        
        // --- ¡LÓGICA DE ROL MODIFICADA! ---
        // Define un email de administrador.
        // ¡Puedes cambiar esto por el email que quieras!
        String adminEmail = "admin@huertohogar.cl";

        if (registerRequest.getEmail().equals(adminEmail)) {
            newUser.setRole("ADMIN"); // Si el email coincide, es ADMIN
        } else {
            newUser.setRole("CUSTOMER"); // Si no, es un cliente normal
        }
        // --- FIN DE LA MODIFICACIÓN ---

        return userRepository.save(newUser);
    }

    public Optional<User> loginUser(String email, String rawPassword) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return userOptional;
            }
        }
        
        return Optional.empty(); 
    }
}