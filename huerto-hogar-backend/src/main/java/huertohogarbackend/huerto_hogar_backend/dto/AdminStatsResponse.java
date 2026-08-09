package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

@Data
public class AdminStatsResponse {
    private long totalProducts;
    private long totalOrders;
    private long totalUsers;
    private double totalRevenue;
}
