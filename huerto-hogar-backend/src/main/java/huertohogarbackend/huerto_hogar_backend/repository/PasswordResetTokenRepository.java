// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/repository/PasswordResetTokenRepository.java
package huertohogarbackend.huerto_hogar_backend.repository;

import huertohogarbackend.huerto_hogar_backend.model.PasswordResetToken;
import huertohogarbackend.huerto_hogar_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /** Solo puede haber un código vigente por usuario a la vez. */
    Optional<PasswordResetToken> findByUser(User user);

    /** Invalida cualquier código anterior al pedir uno nuevo: solo uno vigente por usuario. */
    void deleteByUser(User user);
}
