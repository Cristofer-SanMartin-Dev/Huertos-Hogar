package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

import java.util.List;

/** Métricas simples para la página de Reportes del panel admin. */
@Data
public class AdminReportsResponse {
    private List<ProductStat> topProductsByQuantity;
    private List<ProductStat> topProductsByRevenue;

    @Data
    public static class ProductStat {
        private String productName;
        private double value;

        public ProductStat(String productName, double value) {
            this.productName = productName;
            this.value = value;
        }
    }
}
