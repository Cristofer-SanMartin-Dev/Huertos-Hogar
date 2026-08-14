// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/config/SecurityConfig.java
package huertohogarbackend.huerto_hogar_backend.config;

import huertohogarbackend.huerto_hogar_backend.security.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Configuración de seguridad de la API.
 *
 * Modelo: sin estado (stateless). No hay sesión en el servidor; cada petición
 * protegida debe traer su propio JWT en la cabecera Authorization, que valida
 * el JwtAuthenticationFilter antes de llegar al controlador.
 *
 * Reglas de acceso:
 *  - Públicas: login, registro, recuperación de contraseña, catálogo (solo
 *    lectura) y Swagger. Las imágenes de producto ya no las sirve este
 *    backend: viven en Cloudinary (ver CloudinaryService).
 *  - Autenticadas: edición del perfil propio.
 *  - Solo ADMIN: crear, editar y eliminar productos.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final String allowedOrigins;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            @Value("${app.cors.allowed-origins}") String allowedOrigins) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.allowedOrigins = allowedOrigins;
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Orígenes explícitos (nunca "*"): solo el frontend de HuertoHogar puede llamar a la API.
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        // El token viaja en la cabecera Authorization, no en cookies.
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // CSRF no aplica: API sin cookies de sesión, el token va en una cabecera.
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(authz -> authz

                // Preflight de CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // --- Público ---
                .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/forgot-password", "/api/auth/reset-password").permitAll()
                // Antes que la regla pública de abajo: recomendaciones
                // depende de la sesión de cada usuario, así que no puede ser
                // pública aunque coincida con el mismo patrón /api/products/**.
                .requestMatchers(HttpMethod.GET, "/api/products/recomendados").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/products", "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories", "/api/categories/**").permitAll()
                // "/swagger-ui.html" (sin /index.html) es la URL corta clásica: springdoc
                // la redirige a /swagger-ui/index.html, pero esa redirección nunca llega
                // a ocurrir si Security la bloquea antes con 401.
                .requestMatchers("/swagger-ui.html", "/swagger-ui/**", "/v3/api-docs/**", "/v3/api-docs.yaml").permitAll()
                // Sin esto, cualquier error de un endpoint protegido (ej. falta un campo
                // requerido) se reenvía a /error, Security lo bloquea por no estar
                // autenticado ahí, y el cliente recibe un 401 falso en vez del error real.
                .requestMatchers("/error").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contact").permitAll()

                // --- Reseñas: cualquier cuenta autenticada puede publicar una reseña.
                //     Debe ir ANTES de la regla ADMIN de productos: ambas coinciden con
                //     el mismo patrón /api/products/**, y gana la primera coincidencia. ---
                .requestMatchers(HttpMethod.POST, "/api/products/*/reviews").authenticated()

                // --- Solo administradores: el catálogo se escribe desde el panel admin ---
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasRole("ADMIN")

                // --- Solo administradores: gestionar categorías ---
                .requestMatchers(HttpMethod.POST, "/api/categories").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")

                // --- Solo administradores: leer los mensajes de contacto recibidos ---
                .requestMatchers(HttpMethod.GET, "/api/contact").hasRole("ADMIN")

                // --- Solo administradores: estadísticas del dashboard ---
                .requestMatchers(HttpMethod.GET, "/api/admin/**").hasRole("ADMIN")

                // --- Requiere sesión válida: además, el controlador verifica
                //     que el usuario solo pueda editar su propio perfil ---
                .requestMatchers("/api/auth/profile/**").authenticated()

                // --- Pedidos: solo admin puede cambiar el estado o ver todos los
                //     pedidos; el resto requiere sesión, y el servicio además
                //     verifica que cada quien solo vea sus propios pedidos ---
                .requestMatchers(HttpMethod.PUT, "/api/orders/*/estado").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders").hasRole("ADMIN")
                .requestMatchers("/api/orders/**").authenticated()

                // Todo lo demás, cerrado por defecto
                .anyRequest().authenticated()
            )

            // Respuestas claras en vez del 403 genérico de Spring:
            // 401 = falta sesión o el token no sirve. 403 = hay sesión, pero sin permiso.
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint((request, response, authException) ->
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED,
                                "Se requiere iniciar sesión."))
                .accessDeniedHandler((request, response, deniedException) ->
                        response.sendError(HttpServletResponse.SC_FORBIDDEN,
                                "No tienes permisos para esta acción."))
            )

            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
