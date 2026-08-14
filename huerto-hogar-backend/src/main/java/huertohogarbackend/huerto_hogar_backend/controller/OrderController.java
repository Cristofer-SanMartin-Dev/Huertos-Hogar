package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.config.OpenApiConfig;
import huertohogarbackend.huerto_hogar_backend.dto.CreateOrderRequest;
import huertohogarbackend.huerto_hogar_backend.dto.ErrorResponse;
import huertohogarbackend.huerto_hogar_backend.dto.OrderResponse;
import huertohogarbackend.huerto_hogar_backend.dto.UpdateOrderStatusRequest;
import huertohogarbackend.huerto_hogar_backend.model.Order;
import huertohogarbackend.huerto_hogar_backend.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Pedidos", description = "Creación y consulta de pedidos. Todos los endpoints requieren sesión; ver todos los pedidos o cambiar su estado además requiere rol ADMIN.")
@SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
public class OrderController {

    @Autowired
    private OrderService orderService;

    private boolean isAdmin(UserDetails user) {
        return user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch("ROLE_ADMIN"::equals);
    }

    @PostMapping
    @Operation(
            summary = "Crear un pedido a partir de una lista de productos y cantidades",
            description = """
                    El precio de cada ítem se toma del producto vigente en el SERVIDOR (con su \
                    descuento aplicado si corresponde), nunca del cliente — así el total no se \
                    puede manipular. Descuenta el stock de cada producto; si alguno no tiene \
                    stock suficiente, no se crea nada (todo o nada). Suma puntos de fidelidad \
                    al usuario (1 punto por cada $1.000 en compras)."""
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Pedido creado"),
            @ApiResponse(responseCode = "400", description = "Carrito vacío, producto inexistente, o stock insuficiente para alguno de los productos")
    })
    public ResponseEntity<?> createOrder(
            @RequestBody CreateOrderRequest request,
            @AuthenticationPrincipal UserDetails currentUser) {
        try {
            Order order = orderService.createOrder(request, currentUser.getUsername());
            return ResponseEntity.ok(OrderResponse.from(order));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/mine")
    @Operation(summary = "Listar los pedidos del usuario autenticado", description = "Ordenados del más reciente al más antiguo.")
    public List<OrderResponse> getMyOrders(@AuthenticationPrincipal UserDetails currentUser) {
        return orderService.listByUser(currentUser.getUsername()).stream()
                .map(OrderResponse::from)
                .toList();
    }

    @GetMapping
    @Operation(summary = "Listar TODOS los pedidos de la tienda (solo ADMIN)", description = "Ordenados del más reciente al más antiguo.")
    @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN")
    public List<OrderResponse> getAllOrders() {
        return orderService.listAll().stream()
                .map(OrderResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener el detalle de un pedido", description = "Un cliente solo puede ver sus propios pedidos; un ADMIN puede ver cualquiera.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Detalle del pedido"),
            @ApiResponse(responseCode = "403", description = "El pedido pertenece a otro usuario y quien pregunta no es ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe un pedido con ese id")
    })
    public ResponseEntity<?> getOrderById(
            @Parameter(description = "Id del pedido") @PathVariable Long id,
            @AuthenticationPrincipal UserDetails currentUser) {
        try {
            Order order = orderService.getByIdForRequester(id, currentUser.getUsername(), isAdmin(currentUser));
            return ResponseEntity.ok(OrderResponse.from(order));
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(new ErrorResponse(e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/estado")
    @Operation(
            summary = "Cambiar el estado de un pedido (solo ADMIN)",
            description = "Estados válidos: PENDIENTE, PREPARANDO, ENVIADO, ENTREGADO, CANCELADO. Si el estado realmente cambia, se le manda un correo al cliente avisándole."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estado actualizado"),
            @ApiResponse(responseCode = "400", description = "Estado inválido, o no existe un pedido con ese id"),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN")
    })
    public ResponseEntity<?> updateStatus(
            @Parameter(description = "Id del pedido") @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request) {
        try {
            Order order = orderService.updateStatus(id, request.getEstado());
            return ResponseEntity.ok(OrderResponse.from(order));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }
}
