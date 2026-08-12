package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

import java.util.List;

/** Métricas simples para la página de Reportes y los gráficos del dashboard. */
@Data
public class AdminReportsResponse {
    private List<ProductStat> topProductsByQuantity;
    private List<ProductStat> topProductsByRevenue;
    private List<CategoryStat> revenueByCategory;
    private List<DateStat> salesByDate;

    @Data
    public static class ProductStat {
        private String productName;
        private double value;

        public ProductStat(String productName, double value) {
            this.productName = productName;
            this.value = value;
        }
    }

    @Data
    public static class CategoryStat {
        private String category;
        private double value;

        public CategoryStat(String category, double value) {
            this.category = category;
            this.value = value;
        }
    }

    @Data
    public static class DateStat {
        private String date;
        private double total;

        public DateStat(String date, double total) {
            this.date = date;
            this.total = total;
        }
    }
}
