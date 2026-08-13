// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/config/LegacySchemaCleanupRunner.java
package huertohogarbackend.huerto_hogar_backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Limpieza de arranque, idempotente.
 *
 * La columna "token" de password_reset_tokens quedó huérfana al renombrarla
 * a "code" (código de recuperación de 6 dígitos, en vez del token largo
 * tipo UUID de antes). Hibernate con ddl-auto=update agrega columnas
 * nuevas pero no borra ni renombra las viejas, así que "token" seguía
 * existiendo con su restricción NOT NULL y rompía cualquier pedido de
 * recuperación nuevo (el insert dejaba esa columna en null).
 * DROP COLUMN IF EXISTS es seguro de correr en cada arranque: no hace nada
 * una vez que ya se borró.
 *
 * También purga las filas que quedaron de antes de este cambio: son
 * pedidos de recuperación con el mecanismo viejo (token largo), ya
 * completamente inútiles ahora que el flujo es por código, así que no
 * tiene sentido conservarlas ocupando espacio.
 */
@Component
public class LegacySchemaCleanupRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public LegacySchemaCleanupRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        jdbcTemplate.execute("DELETE FROM password_reset_tokens WHERE code IS NULL");
        jdbcTemplate.execute("ALTER TABLE password_reset_tokens DROP COLUMN IF EXISTS token");
    }
}
