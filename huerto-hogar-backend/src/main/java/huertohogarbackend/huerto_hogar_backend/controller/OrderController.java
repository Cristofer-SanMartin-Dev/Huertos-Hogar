package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.dto.CreateOrderRequest;
import huertohogarbackend.huerto_hogar_backend.dto.OrderResponse;
import huertohogarbackend.huerto_hogar_backend.dto.UpdateOrderStatusRequest;
import huertohogarbackend.huerto_hogar_backend.model.Order;
import huertohogarbackend.huerto_hogar_backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    private boolean isAdmin(UserDetails user) {
        return user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }

    @PostMapping
    public ResponseEntity<?> createOrder(
            @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {
        try {
            Order order = orderService.createOrder(request, currentUser.getUsername());
            return ResponseEntity.ok(OrderResponse.from(order));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/mine")
    public List<OrderResponse> getMyOrders(@AuthenticationPrincipal UserDetails currentUser) {
        return orderService.listByUser(currentUser.getUsername()).stream()
                .map(OrderResponse::from)
                .toList();
    }

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.listAll().stream()
                .map(OrderResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser) {
        try {
            Order order = orderService.getByIdForRequester(id, currentUser.getUsername(), isAdmin(currentUser));
            return ResponseEntity.ok(OrderResponse.from(order));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request) {
        try {
            Order order = orderService.updateStatus(id, request.getEstado());
            return ResponseEntity.ok(OrderResponse.from(order));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
