package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    private List<OrderItemRequest> items;
    private String calle;
    private String region;
    private String comuna;
    private String fechaEntregaPreferida; // ISO (yyyy-MM-dd), opcional

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer cantidad;
    }
}
