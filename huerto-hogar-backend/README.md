# HuertoHogar — Backend

API REST en Spring Boot 3.5.7 (Java 21) para la tienda online HuertoHogar. Ver el [README principal](../README.md) para una visión general del proyecto completo.

## Ejecutar en desarrollo

```bash
./mvnw spring-boot:run
```

Requiere una instancia de MySQL 8 accesible. Por defecto el proyecto asume `jdbc:mysql://localhost:3307/huertohogar_db`, usuario `root`; las tablas se crean/actualizan solas (`spring.jpa.hibernate.ddl-auto=update`), no hace falta correr scripts SQL a mano.

## Variables de entorno

Ninguna es obligatoria para desarrollo local — todas tienen un valor de respaldo en `application.properties` — pero **en producción deben sobrescribirse todas**, especialmente `JWT_SECRET`.

| Variable | Uso | Valor por defecto (solo dev) |
|---|---|---|
| `DB_URL` | URL JDBC de MySQL | `jdbc:mysql://localhost:3307/huertohogar_db` |
| `DB_USERNAME` | Usuario de la BD | `root` |
| `DB_PASSWORD` | Contraseña de la BD | `admin1234` |
| `JWT_SECRET` | Clave de firma HS256 (mín. 32 caracteres) | clave de desarrollo, **no usar en producción** |
| `JWT_EXPIRATION_MS` | Vigencia del token en ms | `28800000` (8 horas) |
| `CORS_ORIGINS` | Orígenes autorizados a llamar la API, separados por coma | `http://localhost:5173` |
| `ADMIN_EMAIL` | Email que obtiene rol `ADMIN` al registrarse (solo una vez, el email es único) | `admin@huertohogar.cl` |

## Tests

```bash
./mvnw test
```

40 pruebas de integración con `@SpringBootTest` + `MockMvc` sobre una base H2 en memoria, cubriendo autenticación, autorización por rol, validación de datos y reglas de negocio del carrito/pedidos.

## Documentación de la API

Con el backend corriendo: `http://localhost:8080/swagger-ui/index.html`.

## Estructura

```
controller/   Endpoints REST
service/      Lógica de negocio y validación
repository/   Acceso a datos (Spring Data JPA)
model/        Entidades JPA
dto/          Objetos de transferencia request/response
security/     JWT, filtros y configuración de Spring Security
```
