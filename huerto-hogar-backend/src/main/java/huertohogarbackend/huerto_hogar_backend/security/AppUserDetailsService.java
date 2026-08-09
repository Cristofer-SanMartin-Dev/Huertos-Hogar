// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/security/AppUserDetailsService.java
package huertohogarbackend.huerto_hogar_backend.security;

import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Puente entre la tabla 'users' y Spring Security.
 *
 * Convierte el rol guardado en base de datos ("ADMIN" / "CUSTOMER") en la
 * autoridad que espera Spring Security ("ROLE_ADMIN" / "ROLE_CUSTOMER"), que
 * es lo que hace funcionar a hasRole("ADMIN") en SecurityConfig.
 */
@Service
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public AppUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));

        String role = user.getRole() == null ? "CUSTOMER" : user.getRole();

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + role))
        );
    }
}
