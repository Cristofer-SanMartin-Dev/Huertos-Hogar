// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/repository/UserRepository.java
package huertohogarbackend.huerto_hogar_backend.repository;

import huertohogarbackend.huerto_hogar_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Busca un usuario por su email, sin distinguir mayúsculas/minúsculas.
     * Usado para el Login. IgnoreCase es necesario aunque el registro
     * normalice a minúsculas, porque hay cuentas creadas antes de ese cambio
     * que pueden tener el email guardado con otra capitalización.
     */
    Optional<User> findByEmailIgnoreCase(String email);

    /**
     * Verifica de forma eficiente si ya existe un usuario con ese email,
     * sin distinguir mayúsculas/minúsculas (mismo motivo que arriba).
     */
    Boolean existsByEmailIgnoreCase(String email);
}