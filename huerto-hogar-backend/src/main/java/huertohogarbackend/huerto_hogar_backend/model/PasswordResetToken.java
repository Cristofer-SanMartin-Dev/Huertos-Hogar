// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/model/PasswordResetToken.java
package huertohogarbackend.huerto_hogar_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Código de un solo uso para el flujo de "recuperar contraseña".
 *
 * Vive en su propia tabla (no como campo en User) porque es un dato
 * transitorio con su propia vigencia, no un atributo permanente de la cuenta.
 *
 * No es único a nivel de base de datos a propósito: es un código de 6
 * dígitos (no un token largo tipo UUID), así que dos usuarios distintos
 * podrían coincidir por azar. Quien lo valida siempre lo hace junto con el
 * email (ver AuthService.restablecerContrasena), así que la coincidencia no
 * es un problema de seguridad.
 */
@Data
@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String code;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime expiryDate;

    // Intentos fallidos de código para este pedido: tras demasiados, el
    // código se invalida y hay que pedir uno nuevo. Frena el fuerza bruta
    // sobre un código de solo 6 dígitos.
    private Integer intentos = 0;
}
