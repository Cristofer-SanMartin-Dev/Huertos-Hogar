// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/service/AuthService.java
package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.dto.RegisterRequest;
import huertohogarbackend.huerto_hogar_backend.dto.UpdateUserRequest;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;
// FIX: Importa la excepción que se usará en 'updateUser'
import org.springframework.security.core.userdetails.UsernameNotFoundException; 

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; 

    // FIX: El método DEBE devolver 'User' (Arregla el error de la línea 25)
    public User registerUser(RegisterRequest registerRequest) {
        
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
        
        String adminEmail = "admin@huertohogar.cl";
        if (registerRequest.getEmail().equals(adminEmail)) {
            newUser.setRole("ADMIN");
        } else {
            newUser.setRole("CUSTOMER");
        }

        return userRepository.save(newUser);
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

    // FIX: Este método también debe devolver 'User'
    public User updateUser(Long userId, UpdateUserRequest updateUserRequest) {
        User userToUpdate = userRepository.findById(userId)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con id: " + userId));

        userToUpdate.setNombre(updateUserRequest.getNombre());
        userToUpdate.setApellidos(updateUserRequest.getApellidos());
        userToUpdate.setCalle(updateUserRequest.getCalle());
        userToUpdate.setRegion(updateUserRequest.getRegion());
        userToUpdate.setComuna(updateUserRequest.getComuna());

        return userRepository.save(userToUpdate);
    }
}