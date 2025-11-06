package huertohogarbackend.huerto_hogar_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * TUTOR: Esta clase configura CORS.
 * Es un mecanismo de seguridad que los navegadores usan. Por defecto,
 * un navegador no deja que una página en 'localhost:5173' (tu React)
 * pida datos a 'localhost:8080' (tu Spring Boot).
 * Esta configuración le da permiso explícito.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Permite CORS para todas las rutas que empiecen con /api/
                // TUTOR: La guía usa localhost:3000. ¡Nosotros usamos 5173 para Vite!
                .allowedOrigins("http://localhost:5173") // Permite peticiones SOLO desde esta URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Métodos HTTP permitidos
                .allowedHeaders("*"); // Permite todas las cabeceras
    }
}