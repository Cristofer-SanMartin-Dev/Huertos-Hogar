// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/config/DemoDataSeeder.java
package huertohogarbackend.huerto_hogar_backend.config;

import huertohogarbackend.huerto_hogar_backend.model.EstadoPedido;
import huertohogarbackend.huerto_hogar_backend.model.Order;
import huertohogarbackend.huerto_hogar_backend.model.OrderItem;
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.model.Review;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.OrderRepository;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import huertohogarbackend.huerto_hogar_backend.repository.ReviewRepository;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Carga clientes, reseñas y pedidos de ejemplo para que el panel de admin
 * (dashboard, reportes, pedidos) y el catálogo público no se vean vacíos en
 * una base de datos recién creada. HuertoHogar es un caso de negocio
 * ficticio hecho para portafolio (no hay clientes reales ni se procesan
 * pagos reales), así que este es contenido de muestra para demostrar las
 * funcionalidades, igual que el catálogo de productos.
 *
 * Solo corre si todavía no hay ningún pedido (ver run()): en un arranque
 * normal, con pedidos ya existentes (reales o de ejemplo), no hace nada —
 * nunca duplica ni pisa datos.
 */
@Component
@org.springframework.core.annotation.Order(3) // Después de ProductSeeder: necesita que los productos ya existan.
public class DemoDataSeeder implements CommandLineRunner {

    private record DemoUser(String nombre, String apellidos, String email, String calle,
                             String region, String comuna, String telefono) {
    }

    private record DemoReview(int userIndex, String producto, int rating, String comentario) {
    }

    private record DemoOrderItem(String producto, int cantidad) {
    }

    private record DemoOrder(int userIndex, EstadoPedido estado, int diasAtras, List<DemoOrderItem> items) {
    }

    // Dominio example.com (RFC 2606): reservado para documentación/pruebas,
    // así que no hay riesgo de que coincida con una casilla real de alguien.
    private static final List<DemoUser> USUARIOS = List.of(
            new DemoUser("María José", "Fernández", "maria.fernandez@example.com",
                    "Los Aromos 452", "Metropolitana", "Ñuñoa", "+56 9 1234 5601"),
            new DemoUser("Diego Alejandro", "Soto", "diego.soto@example.com",
                    "Av. Providencia 1890", "Metropolitana", "Providencia", "+56 9 1234 5602"),
            new DemoUser("Camila Andrea", "Rojas", "camila.rojas@example.com",
                    "Pasaje Las Rosas 221", "Metropolitana", "Maipú", "+56 9 1234 5603"),
            new DemoUser("Felipe Ignacio", "Muñoz", "felipe.munoz@example.com",
                    "Camino Real 88", "Metropolitana", "Puente Alto", "+56 9 1234 5604"),
            new DemoUser("Valentina Paz", "Contreras", "valentina.contreras@example.com",
                    "San Martín 1203", "Metropolitana", "Santiago", "+56 9 1234 5605")
    );

    // Las calificaciones promedio quedan iguales a las que mostraba el sitio
    // antes de perder la base de datos (ver docs/screenshots/productos.png).
    private static final List<DemoReview> RESENAS = List.of(
            new DemoReview(0, "Manzanas Fuji", 5, "Riquísimas y bien crujientes, llegaron en perfecto estado."),
            new DemoReview(1, "Manzanas Fuji", 4, "Muy buenas, aunque un par venían algo golpeadas."),
            new DemoReview(2, "Naranjas Valencia", 5, "Súper jugosas, ideales para el jugo de la mañana."),
            new DemoReview(3, "Plátanos Cavendish", 4, "Buen sabor, llegaron un poco verdes pero maduraron bien."),
            new DemoReview(4, "Plátanos Cavendish", 4, "Buena relación precio-calidad."),
            new DemoReview(0, "Papa Nativa de Campo", 5, "Las mejores papas que he comprado online, se nota que son de campo."),
            new DemoReview(1, "Zanahorias Orgánicas", 5, "Muy dulces y crocantes, perfectas para jugos."),
            new DemoReview(2, "Espinacas Frescas", 4, "Frescas y de buen tamaño, aunque pedí que llegaran un poco antes."),
            new DemoReview(3, "Pimientos Tricolores", 5, "Colores hermosos y muy frescos, le dan vida a cualquier plato."),
            new DemoReview(4, "Miel Orgánica", 5, "Sabor increíble, se nota que es artesanal."),
            new DemoReview(0, "Miel Orgánica", 4, "Muy buena, el envase podría ser más grande."),
            new DemoReview(1, "Quinua Orgánica", 5, "Excelente calidad, llegó bien sellada."),
            new DemoReview(2, "Leche Entera", 4, "Buen sabor, como la de antes."),
            new DemoReview(3, "Yogurt Natural", 5, "Mi favorito, lo pido todas las semanas.")
    );

    private static final List<DemoOrder> PEDIDOS = List.of(
            new DemoOrder(0, EstadoPedido.ENTREGADO, 21, List.of(
                    new DemoOrderItem("Manzanas Fuji", 2), new DemoOrderItem("Leche Entera", 1))),
            new DemoOrder(1, EstadoPedido.ENTREGADO, 17, List.of(
                    new DemoOrderItem("Naranjas Valencia", 3), new DemoOrderItem("Miel Orgánica", 1))),
            new DemoOrder(2, EstadoPedido.ENTREGADO, 12, List.of(
                    new DemoOrderItem("Espinacas Frescas", 2), new DemoOrderItem("Quinua Orgánica", 1))),
            new DemoOrder(3, EstadoPedido.ENVIADO, 6, List.of(
                    new DemoOrderItem("Pimientos Tricolores", 2), new DemoOrderItem("Yogurt Natural", 2))),
            new DemoOrder(4, EstadoPedido.PREPARANDO, 3, List.of(
                    new DemoOrderItem("Papa Nativa de Campo", 2), new DemoOrderItem("Zanahorias Orgánicas", 1))),
            new DemoOrder(0, EstadoPedido.PENDIENTE, 1, List.of(
                    new DemoOrderItem("Plátanos Cavendish", 3))),
            new DemoOrder(2, EstadoPedido.CANCELADO, 9, List.of(
                    new DemoOrderItem("Manzanas Fuji", 1)))
    );

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoDataSeeder(UserRepository userRepository, ProductRepository productRepository,
                           OrderRepository orderRepository, ReviewRepository reviewRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (orderRepository.count() > 0) {
            return; // Ya hay pedidos (reales o de ejemplo): no se toca nada.
        }

        Map<String, Product> productosPorNombre = productRepository.findAll().stream()
                .collect(Collectors.toMap(Product::getName, p -> p));
        if (productosPorNombre.isEmpty()) {
            return; // Sin catálogo todavía: nada que vincular a reseñas/pedidos.
        }

        String passwordDemo = passwordEncoder.encode("Demo1234!");
        List<User> usuarios = new ArrayList<>();
        for (DemoUser demo : USUARIOS) {
            User existente = userRepository.findByEmailIgnoreCase(demo.email()).orElse(null);
            if (existente != null) {
                usuarios.add(existente);
                continue;
            }
            User user = new User();
            user.setNombre(demo.nombre());
            user.setApellidos(demo.apellidos());
            user.setEmail(demo.email());
            user.setPassword(passwordDemo);
            user.setCalle(demo.calle());
            user.setRegion(demo.region());
            user.setComuna(demo.comuna());
            user.setTelefono(demo.telefono());
            user.setRole("CUSTOMER");
            user.setPuntos(0);
            usuarios.add(userRepository.save(user));
        }

        for (DemoReview r : RESENAS) {
            Product product = productosPorNombre.get(r.producto());
            if (product == null) continue;
            Review review = new Review();
            review.setProduct(product);
            review.setUser(usuarios.get(r.userIndex()));
            review.setRating(r.rating());
            review.setComment(r.comentario());
            reviewRepository.save(review);
        }

        for (DemoOrder o : PEDIDOS) {
            User user = usuarios.get(o.userIndex());
            Order order = new Order();
            order.setUser(user);
            order.setEstado(o.estado());
            order.setCalleEnvio(user.getCalle());
            order.setRegionEnvio(user.getRegion());
            order.setComunaEnvio(user.getComuna());

            double total = 0;
            List<OrderItem> items = new ArrayList<>();
            for (DemoOrderItem it : o.items()) {
                Product product = productosPorNombre.get(it.producto());
                if (product == null) continue;

                double precioUnitario = product.getPrecioFinal();
                OrderItem item = new OrderItem();
                item.setOrder(order);
                item.setProduct(product);
                item.setProductName(product.getName());
                item.setUnitPrice(precioUnitario);
                item.setQuantity(it.cantidad());
                items.add(item);
                total += precioUnitario * it.cantidad();

                // Mismo comportamiento que OrderService.crearPedido(): el stock
                // se descuenta al crear el pedido, sin excepción para CANCELADO.
                product.setStock(Math.max(product.getStock() - it.cantidad(), 0));
                productRepository.save(product);
            }
            order.setItems(items);
            order.setTotal(Math.round(total * 100.0) / 100.0);

            // Programa de fidelización: 1 punto por cada $1.000, igual que al
            // crear un pedido real (ver OrderService).
            int puntosGanados = (int) (total / 1000);
            user.setPuntos((user.getPuntos() == null ? 0 : user.getPuntos()) + puntosGanados);
            userRepository.save(user);

            // @PrePersist pisa 'fecha' con LocalDateTime.now() en el primer
            // save(): se guarda una vez para insertar y otra vez para fijar
            // la fecha histórica del pedido de ejemplo.
            Order guardado = orderRepository.save(order);
            guardado.setFecha(LocalDateTime.now().minusDays(o.diasAtras()));
            orderRepository.save(guardado);
        }
    }
}
