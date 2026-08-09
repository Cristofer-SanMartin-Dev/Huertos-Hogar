package huertohogarbackend.huerto_hogar_backend.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime fecha;

    private Double total;

    @Enumerated(EnumType.STRING)
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    // Snapshot de la dirección de envío: si el usuario edita su perfil después,
    // el historial de pedidos no debe cambiar retroactivamente.
    private String calleEnvio;
    private String regionEnvio;
    private String comunaEnvio;

    private LocalDate fechaEntregaPreferida;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.fecha = LocalDateTime.now();
    }
}
