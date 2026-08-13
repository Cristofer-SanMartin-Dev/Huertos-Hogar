package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.dto.AddStockRequest;
import huertohogarbackend.huerto_hogar_backend.dto.ProductResponse;
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.service.ProductService;
import huertohogarbackend.huerto_hogar_backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Importante

import java.io.IOException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ReviewService reviewService;

    private ProductResponse toResponse(Product product) {
        Double avgRating = reviewService.getAverageRating(product.getId());
        Integer reviewCount = reviewService.getReviewCount(product.getId());
        return ProductResponse.from(product, avgRating, reviewCount);
    }

    @GetMapping
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts().stream()
                .map(this::toResponse)
                .toList();
    }

    // Productos destacados de la portada: los 3 con más unidades vendidas,
    // desempatando por mejor calificación promedio. Sin ventas ni reseñas
    // todavía, el orden queda arbitrario (no hay suficiente dato para rankear).
    @GetMapping("/destacados")
    public List<ProductResponse> getFeaturedProducts() {
        Map<Long, Long> unidadesVendidas = productService.unidadesVendidasPorProducto();
        return productService.getAllProducts().stream()
                .map(this::toResponse)
                .sorted(Comparator
                        .comparingLong((ProductResponse r) -> unidadesVendidas.getOrDefault(r.getId(), 0L))
                        .thenComparingDouble(r -> r.getAverageRating() == null ? 0.0 : r.getAverageRating())
                        .reversed())
                .limit(3)
                .toList();
    }

    // Recomendaciones personalizadas: productos de las categorías que el
    // usuario ya compró, priorizando los más vendidos. Requiere sesión
    // porque depende de SU historial de pedidos.
    @GetMapping("/recomendados")
    public List<ProductResponse> getRecommendedProducts(@AuthenticationPrincipal UserDetails currentUser) {
        return productService.getRecommendations(currentUser.getUsername()).stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREAR PRODUCTO (POST)
    // Recibe la imagen (file) y los datos como parámetros
    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestParam("image") MultipartFile image,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("stock") Integer stock,
            @RequestParam("category") String category,
            @RequestParam(value = "origin", required = false) String origin,
            @RequestParam(value = "sustainability", required = false) String sustainability,
            @RequestParam(value = "recipes", required = false) String recipes,
            @RequestParam(value = "descuento", required = false) Integer descuento,
            @RequestParam(value = "unidadMedida", required = false) String unidadMedida
    ) {
        try {
            Product newProduct = new Product();
            newProduct.setName(name);
            newProduct.setDescription(description);
            newProduct.setPrice(price);
            newProduct.setStock(stock);
            newProduct.setCategory(category);
            newProduct.setOrigin(origin);
            newProduct.setSustainability(sustainability);
            newProduct.setRecipes(recipes);
            newProduct.setDescuento(descuento);
            if (unidadMedida != null && !unidadMedida.isBlank()) {
                newProduct.setUnidadMedida(unidadMedida);
            }

            Product savedProduct = productService.saveProduct(newProduct, image);
            return ResponseEntity.ok(savedProduct);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Error al subir la imagen");
        }
    }

    // ACTUALIZAR PRODUCTO (PUT)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestParam(value = "image", required = false) MultipartFile image, // Imagen opcional al editar
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("stock") Integer stock,
            @RequestParam("category") String category,
            @RequestParam(value = "origin", required = false) String origin,
            @RequestParam(value = "sustainability", required = false) String sustainability,
            @RequestParam(value = "recipes", required = false) String recipes,
            @RequestParam(value = "descuento", required = false) Integer descuento,
            @RequestParam(value = "unidadMedida", required = false) String unidadMedida
    ) {
        try {
            Product productDetails = new Product();
            productDetails.setName(name);
            productDetails.setDescription(description);
            productDetails.setPrice(price);
            productDetails.setStock(stock);
            productDetails.setCategory(category);
            productDetails.setOrigin(origin);
            productDetails.setSustainability(sustainability);
            productDetails.setRecipes(recipes);
            productDetails.setDescuento(descuento);
            productDetails.setUnidadMedida((unidadMedida != null && !unidadMedida.isBlank()) ? unidadMedida : "unidad");

            Product updatedProduct = productService.updateProduct(id, productDetails, image);
            return ResponseEntity.ok(updatedProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al actualizar: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage());
        }
    }

    // REPONER STOCK: suma "cantidad" al stock actual (no lo reemplaza).
    @PostMapping("/{id}/stock")
    public ResponseEntity<?> addStock(@PathVariable Long id, @RequestBody AddStockRequest request) {
        try {
            int cantidad = request.getCantidad() == null ? 0 : request.getCantidad();
            Product updated = productService.addStock(id, cantidad);
            return ResponseEntity.ok(toResponse(updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}