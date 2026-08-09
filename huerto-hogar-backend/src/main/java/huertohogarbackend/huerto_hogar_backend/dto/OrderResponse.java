package huertohogarbackend.huerto_hogar_backend.dto;

import huertohogarbackend.huerto_hogar_backend.model.Order;
import huertohogarbackend.huerto_hogar_backend.model.OrderItem;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {

    private Long id;
    private LocalDateTime fecha;
    private String estado;
    private Double total;
    private String calleEnvio;
    private String regionEnvio;
    private String comunaEnvio;
    private LocalDate fechaEntregaPreferida;
    private List<ItemResponse> items;

    public static OrderResponse from(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setFecha(order.getFecha());
        response.setEstado(order.getEstado().name());
        response.setTotal(order.getTotal());
        response.setCalleEnvio(order.getCalleEnvio());
        response.setRegionEnvio(order.getRegionEnvio());
        response.setComunaEnvio(order.getComunaEnvio());
        response.setFechaEntregaPreferida(order.getFechaEntregaPreferida());
        response.setItems(order.getItems().stream().map(ItemResponse::from).toList());
        return response;
    }

    @Data
    public static class ItemResponse {
        private String productName;
        private Double unitPrice;
        private Integer quantity;
        private Double subtotal;

        public static ItemResponse from(OrderItem item) {
            ItemResponse response = new ItemResponse();
            response.setProductName(item.getProductName());
            response.setUnitPrice(item.getUnitPrice());
            response.setQuantity(item.getQuantity());
            response.setSubtotal(item.getUnitPrice() * item.getQuantity());
            return response;
        }
    }
}
