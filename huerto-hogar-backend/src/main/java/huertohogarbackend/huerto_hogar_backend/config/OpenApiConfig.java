// TUTOR: El nombre del paquete coincide con tu nueva carpeta de configuración
package huertohogarbackend.huerto_hogar_backend.config;

// Importaciones de OpenAPI (Swagger)
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * TUTOR: Esta clase configura los metadatos de Swagger .
 * La adaptamos para que muestre la información de HuertoHogar.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("HuertoHogar API") // Título personalizado
                .version("1.0") // Versión de tu API
                .description("API REST para la gestión de productos de la tienda HuertoHogar."));
    }
}