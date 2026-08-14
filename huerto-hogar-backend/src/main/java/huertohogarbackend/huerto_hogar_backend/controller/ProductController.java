package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.config.OpenApiConfig;
import huertohogarbackend.huerto_hogar_backend.dto.AddStockRequest;
import huertohogarbackend.huerto_hogar_backend.dto.ProductResponse;
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.service.ProductService;
import huertohogarbackend.huerto_hogar_backend.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Productos", description = "Catálogo de productos. Lectura pública; crear, editar, eliminar y reponer stock requieren rol ADMIN.")
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
    @Operation(summary = "Listar todo el catálogo", description = "Incluye precio con descuento aplicado (precioConDescuento), calificación promedio y cantidad de reseñas de cada producto.")
    public List<ProductResponse> getAllProducts() {
        return productService.getAllProducts().stream()
                .map(this::toResponse)
                .toList();
    }

    // Productos destacados de la portada: los 3 con más unidades vendidas,
    // desempatando por mejor calificación promedio. Sin ventas ni reseñas
    // todavía, el orden queda arbitrario (no hay suficiente dato para rankear).
    @GetMapping("/destacados")
    @Operation(
            summary = "Los 3 productos destacados de la portada",
            description = "Se eligen automáticamente: primero los más vendidos (unidades en pedidos no cancelados), desempatando por mejor calificación promedio. Si todavía no hay ventas ni reseñas, el orden es arbitrario."
    )
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
    @Operation(
            summary = "Recomendaciones personalizadas para el usuario logueado",
            description = "Productos de las categorías que el usuario ya compró antes, sin repetir lo que ya tiene, priorizando los más vendidos. Sin historial de compras (o si ya tiene todo lo disponible en sus categorías), cae a los productos más populares en general."
    )
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Hasta 4 productos recomendados (puede venir vacío)"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido")
    })
    public List<ProductResponse> getRecommendedProducts(@AuthenticationPrincipal UserDetails currentUser) {
        return productService.getRecommendations(currentUser.getUsername()).stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener un producto por id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto encontrado"),
            @ApiResponse(responseCode = "404", description = "No existe un producto con ese id")
    })
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return productService.getProductById(id)
                .map(this::toResponse)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREAR PRODUCTO (POST)
    // Recibe la imagen (file) y los datos como parámetros
    @PostMapping
    @Operation(
            summary = "Crear un producto",
            description = """
                    multipart/form-data, no JSON: la imagen viaja como archivo (campo "image", \
                    obligatoria) junto con los demás campos como parámetros de formulario. La \
                    imagen se sube a Cloudinary. El código de producto (ej. FR001) se genera solo \
                    según el prefijo de la categoría elegida — no se manda, lo devuelve la respuesta."""
    )
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto creado, con su código autogenerado"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido"),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN"),
            @ApiResponse(responseCode = "500", description = "Falló la subida de la imagen")
    })
    public ResponseEntity<?> createProduct(
            @Parameter(description = "Archivo de imagen (jpg/png), obligatorio") @RequestParam("image") MultipartFile image,
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") Double price,
            @RequestParam("stock") Integer stock,
            @Parameter(description = "Nombre exacto de una categoría existente (ver GET /api/categories)") @RequestParam("category") String category,
            @RequestParam(value = "origin", required = false) String origin,
            @RequestParam(value = "sustainability", required = false) String sustainability,
            @RequestParam(value = "recipes", required = false) String recipes,
            @Parameter(description = "Porcentaje de descuento 0-100; vacío o 0 = sin oferta") @RequestParam(value = "descuento", required = false) Integer descuento,
            @Parameter(description = "Ej: kilo, unidad, bolsa 500g. Por defecto 'unidad'") @RequestParam(value = "unidadMedida", required = false) String unidadMedida
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
    @Operation(
            summary = "Actualizar un producto",
            description = "Igual que crear, pero la imagen es opcional: si no se manda, se conserva la actual. El código de producto no cambia al editar, aunque se cambie la categoría."
    )
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto actualizado"),
            @ApiResponse(responseCode = "400", description = "Error de validación o el producto no existe"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido"),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN")
    })
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @Parameter(description = "Nueva imagen (opcional); si se omite se conserva la actual") @RequestParam(value = "image", required = false) MultipartFile image,
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
    @Operation(summary = "Eliminar un producto", description = "No se puede eliminar un producto que ya tenga pedidos asociados (la FK lo impide) — hay que dejar de venderlo, no borrar el historial de compras.")
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto eliminado"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido"),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN"),
            @ApiResponse(responseCode = "409", description = "El producto tiene pedidos asociados, no se puede eliminar")
    })
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
    @Operation(
            summary = "Reponer stock",
            description = "Suma \"cantidad\" al stock ACTUAL (no lo reemplaza): evita mandar el total a mano y pisar por error el stock ya descontado por pedidos hechos mientras tanto."
    )
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock actualizado; el body trae el producto con el nuevo total"),
            @ApiResponse(responseCode = "400", description = "La cantidad debe ser mayor a 0"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido"),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN"),
            @ApiResponse(responseCode = "404", description = "No existe un producto con ese id")
    })
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
