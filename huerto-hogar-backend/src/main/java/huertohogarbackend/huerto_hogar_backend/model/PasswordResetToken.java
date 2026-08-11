// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/model/PasswordResetToken.java
package huertohogarbackend.huerto_hogar_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Token de un solo uso para el flujo de "recuperar contraseña".
 *
 * Vive en su propia tabla (no como campo en User) porque es un dato
 * transitorio con su propia vigencia, no un atributo permanente de la cuenta.
 */
@Data
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String token;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime expiryDate;
}
