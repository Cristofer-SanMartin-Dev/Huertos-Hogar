package huertohogarbackend.huerto_hogar_backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de la documentación interactiva (Swagger UI).
 *
 * Además de los metadatos, declara el esquema de seguridad "bearer-jwt": eso
 * habilita el botón "Authorize" en Swagger UI, donde se pega el token obtenido
 * en /api/auth/login para poder probar los endpoints protegidos.
 *
 * A propósito NO se aplica como requisito global (sin addSecurityItem acá):
 * eso pondría el candado en TODOS los endpoints, incluidos los públicos como
 * el catálogo. Cada controlador marca con @SecurityRequirement solo los
 * endpoints que de verdad necesitan sesión, así el candado en Swagger UI
 * refleja la regla real (ver SecurityConfig).
 */
@Configuration
public class OpenApiConfig {

    public static final String SECURITY_SCHEME = "bearer-jwt";

    @Bean
    OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("HuertoHogar API")
                .version("1.0")
                .description("""
                    API REST de la tienda HuertoHogar.

                    Autenticación: obtén un token en POST /api/auth/login (o /api/auth/register) \
                    y pégalo en el botón 'Authorize' de arriba a la derecha (sin escribir \
                    'Bearer', Swagger lo añade solo). Los endpoints con el ícono de candado \
                    lo necesitan; el resto es de acceso público.

                    Acceso: el catálogo, categorías y reseñas son de lectura pública; crear, \
                    editar o eliminar productos y categorías requiere rol ADMIN; el perfil y \
                    los pedidos propios solo puede verlos/editarlos su propio dueño; el panel \
                    de administración (/api/admin/**) es exclusivo de ADMIN.

                    Errores: la API no usa un formato de error uniforme — la mayoría de \
                    respuestas 400/403/404/409 devuelven el mensaje como texto plano en el \
                    body, no como JSON."""))

            .components(new Components()
                .addSecuritySchemes(SECURITY_SCHEME, new SecurityScheme()
                    .type(SecurityScheme.Type.HTTP)
                    .scheme("bearer")
                    .bearerFormat("JWT")
                    .description("Token JWT devuelto por /api/auth/login o /api/auth/register")));
    }
}
