package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.dto.ProductResponse;
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.service.ProductService;
import huertohogarbackend.huerto_hogar_backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Importante

import java.io.IOException;
import java.util.List;

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
            @RequestParam(value = "descuento", required = false) Integer descuento
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
            @RequestParam(value = "descuento", required = false) Integer descuento
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
}