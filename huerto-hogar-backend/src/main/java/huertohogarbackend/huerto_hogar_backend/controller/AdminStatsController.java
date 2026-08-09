package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.dto.AdminReportsResponse;
import huertohogarbackend.huerto_hogar_backend.dto.AdminStatsResponse;
import huertohogarbackend.huerto_hogar_backend.dto.UserSummaryResponse;
import huertohogarbackend.huerto_hogar_backend.model.EstadoPedido;
import huertohogarbackend.huerto_hogar_backend.model.Order;
import huertohogarbackend.huerto_hogar_backend.model.OrderItem;
import huertohogarbackend.huerto_hogar_backend.repository.OrderRepository;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Agregador de datos para el panel admin: estadísticas, usuarios y reportes.
 *
 * Es un controlador delgado a propósito: consulta directamente los
 * repositorios en vez de crear un AdminService completo para unos pocos
 * métodos de solo lectura.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminStatsController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public AdminStatsResponse getStats() {
        AdminStatsResponse stats = new AdminStatsResponse();
        stats.setTotalProducts(productRepository.count());
        stats.setTotalUsers(userRepository.count());

        var orders = orderRepository.findAll();
        stats.setTotalOrders(orders.size());

        double revenue = orders.stream()
                .filter(order -> order.getEstado() != EstadoPedido.CANCELADO)
                .mapToDouble(Order::getTotal)
                .sum();
        stats.setTotalRevenue(revenue);

        return stats;
    }

    @GetMapping("/users")
    public List<UserSummaryResponse> getUsers() {
        return userRepository.findAll().stream()
                .map(UserSummaryResponse::from)
                .toList();
    }

    @GetMapping("/reports")
    public AdminReportsResponse getReports() {
        List<OrderItem> items = orderRepository.findAll().stream()
                .filter(order -> order.getEstado() != EstadoPedido.CANCELADO)
                .flatMap(order -> order.getItems().stream())
                .toList();

        Map<String, Double> cantidadPorProducto = items.stream()
                .collect(Collectors.groupingBy(
                        OrderItem::getProductName,
                        Collectors.summingDouble(OrderItem::getQuantity)));

        Map<String, Double> ingresoPorProducto = items.stream()
                .collect(Collectors.groupingBy(
                        OrderItem::getProductName,
                        Collectors.summingDouble(i -> i.getUnitPrice() * i.getQuantity())));

        AdminReportsResponse response = new AdminReportsResponse();
        response.setTopProductsByQuantity(top5(cantidadPorProducto));
        response.setTopProductsByRevenue(top5(ingresoPorProducto));
        return response;
    }

    private List<AdminReportsResponse.ProductStat> top5(Map<String, Double> valores) {
        return valores.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(5)
                .map(e -> new AdminReportsResponse.ProductStat(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }
}
