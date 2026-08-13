package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.dto.CreateOrderRequest;
import huertohogarbackend.huerto_hogar_backend.model.EstadoPedido;
import huertohogarbackend.huerto_hogar_backend.model.Order;
import huertohogarbackend.huerto_hogar_backend.model.OrderItem;
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.OrderRepository;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Crea un pedido a partir del carrito.
     *
     * El precio de cada ítem se toma del producto vigente en el servidor, NUNCA
     * de lo que envíe el cliente: así el total no se puede manipular. Si algún
     * producto no tiene stock suficiente, se lanza una excepción y @Transactional
     * revierte todo (no quedan descuentos de stock a medias).
     */
    @Transactional
    public Order createOrder(CreateOrderRequest dto, String requesterEmail) {
        User user = userRepository.findByEmailIgnoreCase(requesterEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + requesterEmail));

        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new IllegalArgumentException("El pedido no puede estar vacío.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setCalleEnvio(dto.getCalle());
        order.setRegionEnvio(dto.getRegion());
        order.setComunaEnvio(dto.getComuna());
        if (dto.getFechaEntregaPreferida() != null && !dto.getFechaEntregaPreferida().isBlank()) {
            order.setFechaEntregaPreferida(LocalDate.parse(dto.getFechaEntregaPreferida()));
        }

        double total = 0;
        for (CreateOrderRequest.OrderItemRequest itemRequest : dto.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Producto no encontrado con id: " + itemRequest.getProductId()));

            if (product.getStock() == null || product.getStock() < itemRequest.getCantidad()) {
                throw new IllegalArgumentException(
                        "Stock insuficiente para " + product.getName() + ".");
            }

            product.setStock(product.getStock() - itemRequest.getCantidad());
            productRepository.save(product);

            // getPrecioFinal() aplica el descuento si el producto está en oferta:
            // sin esto se cobraba el precio de lista completo aunque el
            // catálogo mostrara un precio rebajado.
            double precioUnitario = product.getPrecioFinal();

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setProductName(product.getName());
            item.setUnitPrice(precioUnitario);
            item.setQuantity(itemRequest.getCantidad());
            order.getItems().add(item);

            total += precioUnitario * itemRequest.getCantidad();
        }

        order.setTotal(total);
        Order savedOrder = orderRepository.save(order);

        // Programa de fidelización: 1 punto por cada $1.000 en compras.
        int puntosGanados = (int) (total / 1000);
        user.setPuntos((user.getPuntos() == null ? 0 : user.getPuntos()) + puntosGanados);
        userRepository.save(user);

        return savedOrder;
    }

    public List<Order> listByUser(String requesterEmail) {
        User user = userRepository.findByEmailIgnoreCase(requesterEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + requesterEmail));
        return orderRepository.findByUserIdOrderByFechaDesc(user.getId());
    }

    public List<Order> listAll() {
        return orderRepository.findAllByOrderByFechaDesc();
    }

    public Order getByIdForRequester(Long orderId, String requesterEmail, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado con id: " + orderId));

        if (!isAdmin && !order.getUser().getEmail().equalsIgnoreCase(requesterEmail)) {
            throw new AccessDeniedException("No puedes ver un pedido de otro usuario.");
        }

        return order;
    }

    public Order updateStatus(Long orderId, String nuevoEstado) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Pedido no encontrado con id: " + orderId));

        EstadoPedido estadoAnterior = order.getEstado();
        EstadoPedido estadoNuevo;
        try {
            estadoNuevo = EstadoPedido.valueOf(nuevoEstado.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Estado inválido: " + nuevoEstado);
        }
        order.setEstado(estadoNuevo);

        Order actualizado = orderRepository.save(order);

        // Solo si el estado realmente cambió: evita mandar un correo cuando el
        // admin reenvía el mismo estado que ya tenía el pedido.
        if (estadoAnterior != estadoNuevo) {
            User cliente = order.getUser();
            emailService.enviarCorreoCambioEstado(cliente.getEmail(), cliente.getNombre(), actualizado);
        }

        return actualizado;
    }
}
