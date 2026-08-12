# HuertoHogar — Backend

API REST en Spring Boot 3.5.7 (Java 21) para la tienda online HuertoHogar. Ver el [README principal](../README.md) para una visión general del proyecto completo (incluye el frontend).

## Tabla de contenidos

- [Arquitectura](#arquitectura)
- [Modelo de seguridad](#modelo-de-seguridad)
- [Endpoints](#endpoints)
- [Ejecutar en desarrollo](#ejecutar-en-desarrollo)
- [Variables de entorno](#variables-de-entorno)
- [Base de datos](#base-de-datos)
- [Tests](#tests)
- [Estructura](#estructura)

## Arquitectura

Arquitectura en capas clásica de Spring, cada una con una única responsabilidad:

```
Controller   → recibe la petición HTTP, valida el contrato (DTO) y delega
Service      → reglas de negocio y validación real de los datos
Repository   → acceso a datos (Spring Data JPA, sin SQL manual)
Model        → entidades JPA, mapeadas 1:1 a las tablas
DTO          → forma de entrada/salida de la API, separada de las entidades
Security     → JWT, filtros de autenticación y configuración de autorización
```

La validación de negocio vive en el `service`, no en el `controller` ni solo en el frontend: cualquiera puede llamar a la API directamente sin pasar por el formulario, así que la fuente de verdad de "¿son válidos estos datos?" es siempre el servidor. El frontend repite las mismas reglas únicamente para dar feedback inmediato al usuario.

## Modelo de seguridad

- **Autenticación:** JWT firmado con HS256 (`jjwt`), sin estado de sesión en el servidor. `POST /api/auth/login` o `/register` devuelven el token; el cliente lo reenvía como `Authorization: Bearer <token>` en cada petición protegida.
- **Contraseñas:** hasheadas con BCrypt (`PasswordEncoder`), nunca se devuelven ni se guardan en texto plano.
- **Autorización:** dos niveles, ambos en el servidor:
  1. Por ruta y rol, declarado en `SecurityConfig` (`hasRole("ADMIN")`, `authenticated()`, `permitAll()`).
  2. Por propiedad del recurso, verificado en el propio `service` — por ejemplo, `AuthService.updateUser` comprueba que el `id` de la URL corresponda al usuario del token antes de aplicar cambios, para que nadie pueda editar el perfil de otra persona cambiando el id en la petición.
- **Tokens huérfanos:** si la cuenta de un token fue eliminada, `JwtAuthenticationFilter` lo detecta y deja pasar la petición como anónima en vez de romper con un 500, para que rutas públicas (como el catálogo) sigan funcionando.

## Endpoints

Documentación interactiva completa (Swagger UI) con el backend corriendo: `http://localhost:8080/swagger-ui/index.html`.

**Autenticación** — `/api/auth`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/register` | Público | Registra un usuario y devuelve su JWT |
| POST | `/login` | Público | Autentica y devuelve un JWT |
| GET | `/me` | Autenticado | Datos vigentes del usuario del token |
| PUT | `/profile/{userId}` | Autenticado (solo el dueño) | Edita nombre, dirección y teléfono |
| POST | `/forgot-password` | Público | Genera un token de recuperación y envía el correo (responde igual exista o no el email) |
| POST | `/reset-password` | Público | Cambia la contraseña usando el token del correo |

**Catálogo** — `/api/products`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Público | Lista el catálogo completo |
| GET | `/{id}` | Público | Detalle de un producto |
| POST | `/` | `ADMIN` | Crea un producto (multipart, con imagen) |
| PUT | `/{id}` | `ADMIN` | Edita un producto |
| DELETE | `/{id}` | `ADMIN` | Elimina un producto |

**Reseñas** — `/api/products/{productId}/reviews`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/` | Público | Lista las reseñas de un producto |
| POST | `/` | Autenticado | Publica una reseña con calificación |

**Pedidos** — `/api/orders`

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/` | Autenticado | Crea un pedido (checkout) validando stock |
| GET | `/mine` | Autenticado | Pedidos del usuario del token |
| GET | `/{id}` | Autenticado (dueño o `ADMIN`) | Detalle de un pedido |
| GET | `/` | `ADMIN` | Todos los pedidos |
| PUT | `/{id}/estado` | `ADMIN` | Actualiza el estado de un pedido |

**Contacto y administración**

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/contact` | Público | Envía un mensaje de contacto |
| GET | `/api/contact` | `ADMIN` | Lista los mensajes recibidos |
| GET | `/api/admin/stats` | `ADMIN` | Estadísticas para el dashboard |
| GET | `/api/admin/users` | `ADMIN` | Lista de usuarios registrados |
| GET | `/api/admin/reports` | `ADMIN` | Reportes agregados |

## Ejecutar en desarrollo

```bash
./mvnw spring-boot:run
```

Requiere una instancia de PostgreSQL accesible, con la base `huertohogar_db` ya creada (Postgres no la crea solo). Por defecto el proyecto asume `jdbc:postgresql://127.0.0.1:5432/huertohogar_db`, usuario `postgres`; las tablas se crean/actualizan solas (`spring.jpa.hibernate.ddl-auto=update`), no hace falta correr scripts SQL a mano.

## Variables de entorno

Ninguna es obligatoria para desarrollo local — todas tienen un valor de respaldo en `application.properties` — pero **en producción deben sobrescribirse todas**, especialmente `JWT_SECRET`.

Para desarrollo local, la forma más simple de setearlas (en particular las de correo, que si no están el envío de recuperación de contraseña falla silenciosamente) es un archivo `.env` en esta carpeta:

```bash
cp .env.example .env
# editar .env con tus credenciales reales
```

`application.properties` lo importa automáticamente (`spring.config.import=optional:file:.env[.properties]`) si existe; `.env` está en `.gitignore`, nunca se sube al repo.

| Variable | Uso | Valor por defecto (solo dev) |
|---|---|---|
| `DB_URL` | URL JDBC de PostgreSQL | `jdbc:postgresql://127.0.0.1:5432/huertohogar_db` |
| `DB_USERNAME` | Usuario de la BD | `postgres` |
| `DB_PASSWORD` | Contraseña de la BD | *(sin default, obligatoria)* |
| `JWT_SECRET` | Clave de firma HS256 (mín. 32 caracteres) | clave de desarrollo, **no usar en producción** |
| `JWT_EXPIRATION_MS` | Vigencia del token en ms | `28800000` (8 horas) |
| `CORS_ORIGINS` | Orígenes autorizados a llamar la API, separados por coma | `http://localhost:5173` |
| `ADMIN_EMAIL` | Email que obtiene rol `ADMIN` al registrarse (solo una vez, el email es único) | `admin@huertohogar.cl` |
| `RESEND_API_KEY` | API key de [Resend](https://resend.com) para el correo de recuperación de contraseña (gratis, hasta 3.000/mes) | *(vacío)* |
| `MAIL_FROM` | Remitente que verá el usuario. `onboarding@resend.dev` funciona sin verificar dominio propio, pero en modo prueba Resend solo entrega a la casilla con la que te registraste — para enviarle a cualquier usuario real hace falta verificar un dominio propio en Resend | `onboarding@resend.dev` |
| `FRONTEND_URL` | URL del frontend, para construir el enlace dentro del correo de recuperación | `http://localhost:5173` |

Sin `RESEND_API_KEY` el envío de correo se omite silenciosamente (se registra en el log del servidor) pero la petición igual responde 200: el resto de la aplicación no depende del correo, y la respuesta nunca revela si el envío falló o si el email simplemente no existía.

## Base de datos

El esquema se genera y mantiene automáticamente desde las entidades JPA (`ddl-auto=update`): no hay migraciones ni scripts `.sql` que ejecutar a mano, solo crear la base vacía (`huertohogar_db`) antes del primer arranque. Las imágenes de producto se guardan en disco (carpeta `uploads/`, servida en `/images/**`) y se referencian por nombre de archivo en la tabla `products`.

## Tests

```bash
./mvnw test
```

47 pruebas de integración con `@SpringBootTest` + `MockMvc` sobre una base H2 en memoria (no toca la base de datos real), organizadas en:

- **`SecurityRulesTest`** — que cada regla de autorización se cumpla atacando el endpoint directamente (sin token, con token de otro usuario, con token alterado, con token de una cuenta ya eliminada).
- **`RegistrationValidationTest`** — formato de email, fortaleza de contraseña, formato de nombre y teléfono.
- **`OrderControllerTest`** — creación de pedidos, validación de stock, visibilidad por dueño/admin.
- **`ReviewControllerTest`** — publicación y listado de reseñas.
- **`PasswordResetTest`** — generación de token, que nunca revele si un email existe, expiración, y que el token se consuma (no se pueda reusar). Sin `RESEND_API_KEY` configurada, el envío de correo se omite sin red, sin depender de credenciales reales.

## Estructura

```
controller/   Endpoints REST
service/      Lógica de negocio y validación
repository/   Acceso a datos (Spring Data JPA)
model/        Entidades JPA
dto/          Objetos de transferencia request/response
security/     JWT, filtros y configuración de Spring Security
```
