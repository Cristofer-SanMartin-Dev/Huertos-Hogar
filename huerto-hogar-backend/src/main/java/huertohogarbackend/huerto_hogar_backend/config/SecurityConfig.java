package huertohogarbackend.huerto_hogar_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    /**
     * TUTOR: Este método crea un "Bean" (un objeto gestionado por Spring)
     * que sabe cómo encriptar y verificar contraseñas usando el algoritmo
     * BCrypt, que es el estándar de la industria.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * TUTOR: Por defecto, Spring Security bloquea TODAS las peticiones.
     * Este método configura la seguridad para PERMITIR el acceso
     * a nuestra API y a la documentación de Swagger.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Deshabilita CSRF (un tipo de protección)
            .authorizeHttpRequests(authz -> authz
                // Permite el acceso a nuestra API de productos y de registro
                .requestMatchers("/api/products/**", "/api/auth/**").permitAll() 
                // Permite el acceso a la documentación de Swagger
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // Pide autenticación para cualquier otra petición
                .anyRequest().authenticated()
            );
        return http.build();
    }
}