package huertohogarbackend.huerto_hogar_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonIgnore // Evita un ciclo infinito Order -> items -> order -> items...
    private Order order;

    // Nulo si el producto fue eliminado después de la compra: el pedido
    // conserva su historial gracias al snapshot de nombre y precio de abajo.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    private String productName; // Snapshot: nombre al momento de la compra
    private Double unitPrice;   // Snapshot: precio al momento de la compra
    private Integer quantity;
}
