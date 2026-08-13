package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.model.EstadoPedido;
import huertohogarbackend.huerto_hogar_backend.model.Order;
import huertohogarbackend.huerto_hogar_backend.model.OrderItem;
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.OrderRepository;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    /** Unidades vendidas por producto (pedidos no cancelados). Usado para elegir los destacados de la portada. */
    public Map<Long, Long> unidadesVendidasPorProducto() {
        return orderRepository.findAll().stream()
                .filter(order -> order.getEstado() != EstadoPedido.CANCELADO)
                .flatMap(order -> order.getItems().stream())
                .filter(item -> item.getProduct() != null)
                .collect(Collectors.groupingBy(
                        item -> item.getProduct().getId(),
                        Collectors.summingLong(item -> item.getQuantity())));
    }

    /**
     * Recomendaciones para un usuario: productos de las categorías que ya
     * compró, sin repetir lo que ya tiene, priorizando los más vendidos.
     * Sin historial (o si ya compró todo lo disponible en esas categorías),
     * cae a los productos más populares en general.
     */
    public List<Product> getRecommendations(String email) {
        Map<Long, Long> unidadesVendidas = unidadesVendidasPorProducto();
        List<Product> todos = productRepository.findAll();

        User user = userRepository.findByEmail(email).orElse(null);
        Set<String> categoriasCompradas = new HashSet<>();
        Set<Long> productosComprados = new HashSet<>();

        if (user != null) {
            List<Order> pedidos = orderRepository.findByUserIdOrderByFechaDesc(user.getId());
            for (Order pedido : pedidos) {
                if (pedido.getEstado() == EstadoPedido.CANCELADO) continue;
                for (OrderItem item : pedido.getItems()) {
                    if (item.getProduct() == null) continue;
                    productosComprados.add(item.getProduct().getId());
                    if (item.getProduct().getCategory() != null) {
                        categoriasCompradas.add(item.getProduct().getCategory());
                    }
                }
            }
        }

        List<Product> candidatos = todos.stream()
                .filter(p -> categoriasCompradas.isEmpty() || categoriasCompradas.contains(p.getCategory()))
                .filter(p -> !productosComprados.contains(p.getId()))
                .toList();

        if (candidatos.isEmpty()) {
            // Ya tiene todo lo disponible en sus categorías habituales: se
            // recomienda lo más popular en general en vez de dejarlo sin nada.
            candidatos = todos.stream()
                    .filter(p -> !productosComprados.contains(p.getId()))
                    .toList();
        }

        return candidatos.stream()
                .sorted(Comparator.comparingLong((Product p) -> unidadesVendidas.getOrDefault(p.getId(), 0L)).reversed())
                .limit(4)
                .toList();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Guardar producto CON imagen
    public Product saveProduct(Product product, MultipartFile imageFile) throws IOException {
        categoryService.findByName(product.getCategory())
                .ifPresent(category -> product.setCode(categoryService.generarSiguienteCodigo(category)));

        if (imageFile != null && !imageFile.isEmpty()) {
            String url = cloudinaryService.upload(imageFile);
            if (url != null) {
                product.setImageName(url);
            }
        }
        return productRepository.save(product);
    }

    // Actualizar producto
    public Product updateProduct(Long id, Product productDetails, MultipartFile imageFile) throws IOException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setCategory(productDetails.getCategory());
        product.setOrigin(productDetails.getOrigin());
        product.setSustainability(productDetails.getSustainability());
        product.setRecipes(productDetails.getRecipes());
        product.setDescuento(productDetails.getDescuento());
        product.setUnidadMedida(productDetails.getUnidadMedida());

        // Si viene una nueva imagen, se sube y se reemplaza; si no, se
        // conserva la que ya tenía el producto.
        if (imageFile != null && !imageFile.isEmpty()) {
            String url = cloudinaryService.upload(imageFile);
            if (url != null) {
                product.setImageName(url);
            }
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        try {
            productRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            // El producto tiene pedidos asociados (OrderItem lo referencia por FK).
            throw new RuntimeException("No se puede eliminar un producto con pedidos asociados.");
        }
    }

    /**
     * Repone stock sumando una cantidad al total actual, en vez de reemplazarlo.
     * Evita el error de mandar el valor final "a ojo" y pisar el stock real
     * (por ejemplo, el ya descontado por pedidos hechos mientras tanto).
     */
    @Transactional
    public Product addStock(Long id, int cantidad) {
        if (cantidad <= 0) {
            throw new IllegalArgumentException("La cantidad a reponer debe ser mayor a 0.");
        }
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        product.setStock(product.getStock() + cantidad);
        return productRepository.save(product);
    }
}
