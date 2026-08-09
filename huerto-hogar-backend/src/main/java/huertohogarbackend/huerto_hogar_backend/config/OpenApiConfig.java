package huertohogarbackend.huerto_hogar_backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de la documentación interactiva (Swagger UI).
 *
 * Además de los metadatos, declara el esquema de seguridad "bearer-jwt": eso
 * habilita el botón "Authorize" en Swagger UI, donde se pega el token obtenido
 * en /api/auth/login para poder probar los endpoints protegidos.
 */
@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME = "bearer-jwt";

    @Bean
    OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("HuertoHogar API")
                .version("1.0")
                .description("""
                    API REST de la tienda HuertoHogar.

                    Autenticación: obtén un token en POST /api/auth/login y pégalo \
                    en el botón 'Authorize' (sin escribir 'Bearer', Swagger lo añade).

                    Acceso: el catálogo es de lectura pública; crear, editar y \
                    eliminar productos requiere rol ADMIN; el perfil solo puede \
                    editarlo su propio dueño."""))

            .components(new Components()
                .addSecuritySchemes(SECURITY_SCHEME, new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Token JWT devuelto por /api/auth/login")))

            .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME));
    }
}
