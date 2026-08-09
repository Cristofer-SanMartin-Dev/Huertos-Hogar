package huertohogarbackend.huerto_hogar_backend.repository;

import huertohogarbackend.huerto_hogar_backend.model.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findAllByOrderByFechaDesc();
}
