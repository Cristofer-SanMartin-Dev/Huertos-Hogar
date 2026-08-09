// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/security/JwtService.java
package huertohogarbackend.huerto_hogar_backend.security;

import huertohogarbackend.huerto_hogar_backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Genera y valida los tokens JWT que identifican al usuario en cada petición.
 *
 * El token lleva firmado el email (subject), el id y el rol del usuario, de
 * modo que el backend no necesita confiar en nada que envíe el navegador:
 * la firma HMAC se verifica en cada request antes de dar por válido el token.
 */
@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMillis;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMillis) {

        // HS256 exige una clave de al menos 256 bits (32 caracteres).
        if (secret == null || secret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException(
                    "app.jwt.secret debe tener al menos 32 caracteres para firmar con HS256.");
        }
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMillis = expirationMillis;
    }

    /** Crea un token firmado para el usuario recién autenticado. */
    public String generateToken(User user) {
        Date now = new Date();
        return Jwts.builder()
                .subject(user.getEmail())
                .claim("uid", user.getId())
                .claim("role", user.getRole())
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMillis))
                .signWith(signingKey)
                .compact();
    }

    /** Devuelve el email contenido en el token, verificando antes la firma y la expiración. */
    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    /** Devuelve el id de usuario contenido en el token. */
    public Long extractUserId(String token) {
        return parseClaims(token).get("uid", Long.class);
    }

    /**
     * Verifica firma y expiración. Lanza JwtException si el token fue alterado,
     * está vencido o no corresponde a esta aplicación.
     */
    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public long getExpirationMillis() {
        return expirationMillis;
    }
}
