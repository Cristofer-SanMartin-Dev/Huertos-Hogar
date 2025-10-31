package huertohogarbackend.huerto_hogar_backend.repository;

import huertohogarbackend.huerto_hogar_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * TUTOR: Este es el Repositorio para la entidad User .
 * Extiende JpaRepository para <User, Long>.
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * TUTOR: ¡Esto es un método de consulta personalizado!
     * Spring Data JPA es lo suficientemente inteligente como para entender
     * "findByEmail". Automáticamente generará una consulta SQL que
     * busca un usuario por su columna 'email'.
     *
     * Lo usaremos en nuestro servicio de autenticación para
     * buscar usuarios cuando intenten iniciar sesión.
     */
    Optional<User> findByEmail(String email);
}