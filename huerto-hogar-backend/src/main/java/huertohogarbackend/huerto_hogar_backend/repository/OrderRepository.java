package huertohogarbackend.huerto_hogar_backend.repository;

import huertohogarbackend.huerto_hogar_backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByFechaDesc(Long userId);

    List<Order> findAllByOrderByFechaDesc();
}
