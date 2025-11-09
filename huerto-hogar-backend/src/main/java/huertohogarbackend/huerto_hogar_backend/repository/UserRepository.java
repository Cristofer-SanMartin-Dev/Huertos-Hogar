// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/repository/UserRepository.java
package huertohogarbackend.huerto_hogar_backend.repository;

import huertohogarbackend.huerto_hogar_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Busca un usuario por su email.
     * Usado para el Login.
     */
    Optional<User> findByEmail(String email);
    
    /**
     * --- MÉTODO AÑADIDO ---
     * Verifica de forma eficiente si ya existe un usuario con ese email.
     * Spring Data JPA entiende "existsByEmail" y crea la consulta.
     * Lo usaremos en AuthService para evitar registros duplicados.
     */
    Boolean existsByEmail(String email);
}