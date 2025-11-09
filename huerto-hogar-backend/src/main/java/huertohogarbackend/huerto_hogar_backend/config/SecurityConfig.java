package huertohogarbackend.huerto_hogar_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Deshabilita CSRF
            .authorizeHttpRequests(authz -> authz
                // Permite acceso PÚBLICO a productos y autenticación (login/registro)
                .requestMatchers("/api/products/**", "/api/auth/**").permitAll() 
                // Permite acceso PÚBLICO a Swagger
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                // Pide autenticación para CUALQUIER OTRA petición
                .anyRequest().authenticated()
            );
        return http.build();
    }
}