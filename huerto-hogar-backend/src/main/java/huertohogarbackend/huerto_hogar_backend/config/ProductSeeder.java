// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/config/ProductSeeder.java
package huertohogarbackend.huerto_hogar_backend.config;

import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import huertohogarbackend.huerto_hogar_backend.service.CategoryService;
import huertohogarbackend.huerto_hogar_backend.service.CloudinaryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

/**
 * Repuebla el catálogo con el set de productos de referencia cuando la base
 * de datos arranca completamente vacía (ej. después de que Render borre el
 * Postgres free a los 30 días y haya que crear uno nuevo).
 *
 * Solo corre si no hay NINGÚN producto todavía (ver run()): en un arranque
 * normal, con productos ya cargados (reales o no), no toca nada. Así se evita
 * pisar datos reales por accidente.
 *
 * Las imágenes viven en src/main/resources/seed-images/ y se suben a
 * Cloudinary igual que al crear un producto desde el panel admin.
 */
@Component
@Order(2) // Después de CategorySeeder: necesita que las categorías ya existan.
public class ProductSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(ProductSeeder.class);

    private record SeedProduct(
            String nombre, String descripcion, double precio, String unidad,
            int stock, String categoria, String origen, Integer descuento, String imagen) {
    }

    private static final List<SeedProduct> PRODUCTOS = List.of(
            new SeedProduct("Manzanas Fuji",
                    "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule. Perfectas para meriendas saludables o como ingrediente en postres. Estas manzanas son conocidas por su textura firme y su sabor equilibrado entre dulce y ácido.",
                    1200, "kilo", 183, "Frutas Frescas", "Valle del Maule", null, "manzana.png"),
            new SeedProduct("Naranjas Valencia",
                    "Jugosas y ricas en vitamina C, estas naranjas Valencia son ideales para zumos frescos y refrescantes. Cultivadas en condiciones climáticas óptimas que aseguran su dulzura y jugosidad.",
                    1000, "kilo", 196, "Frutas Frescas", null, 15, "naranja.png"),
            new SeedProduct("Plátanos Cavendish",
                    "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético. Estos plátanos son ricos en potasio y vitaminas, ideales para mantener una dieta equilibrada.",
                    800, "kilo", 246, "Frutas Frescas", null, null, "platano.png"),
            new SeedProduct("Papa Nativa de Campo",
                    "Papas frescas recién cosechadas de cultivo tradicional, caracterizadas por su piel firme, textura cremosa y sabor terroso profundo. Ideales para todo tipo de preparaciones culinarias gracias a su versatilidad, bajo contenido de agua y excelente retención de consistencia tanto al horno como en cocción lenta o fritura.",
                    1500, "kilo", 171, "Verduras Orgánicas", null, 10, "papas-de-campo.png"),
            new SeedProduct("Zanahorias Orgánicas",
                    "Zanahorias frescas cultivadas sin pesticidas, crujientes y dulces, ideales para ensaladas, jugos o como snack saludable.",
                    900, "kilo", 92, "Verduras Orgánicas", null, null, "zanahoria.png"),
            new SeedProduct("Espinacas Frescas",
                    "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes. Estas espinacas son cultivadas bajo prácticas orgánicas que garantizan su calidad y valor nutricional.",
                    700, "bolsa 500g", 80, "Verduras Orgánicas", null, 10, "espinacas.png"),
            new SeedProduct("Pimientos Tricolores",
                    "Pimientos rojos, amarillos y verdes, ideales para salteados o platos coloridos. Ricos en antioxidantes y vitaminas, estos pimientos añaden un toque vibrante y saludable a cualquier receta.",
                    1500, "unidad", 134, "Verduras Orgánicas", null, null, "pimenton.png"),
            new SeedProduct("Miel Orgánica",
                    "Miel pura y orgánica producida por apicultores locales. Rica en antioxidantes y con un sabor inigualable, perfecta para endulzar de manera natural tus comidas y bebidas.",
                    5000, "frasco 500g", 46, "Productos Orgánicos", null, null, "miel.png"),
            new SeedProduct("Quinua Orgánica",
                    "Quinua orgánica de grano entero, una fuente completa de proteína vegetal y libre de gluten. Cultivada en el altiplano chileno bajo prácticas agrícolas ancestrales y sostenibles.",
                    3500, "bolsa 500g", 79, "Productos Orgánicos", "Altiplano chileno", 20, "quinua.png"),
            new SeedProduct("Leche Entera",
                    "Leche entera fresca proveniente de granjas lecheras locales, sometida a pasteurización cuidadosa para conservar su sabor natural y valor nutricional. Ideal para el consumo diario de toda la familia.",
                    1100, "litro", 176, "Productos Lácteos", null, null, "leche.png"),
            new SeedProduct("Yogurt Natural",
                    "Yogurt natural artesanal, elaborado con leche fresca y cultivos vivos. Sin azúcar añadida, ideal para acompañar frutas, granola o consumir solo.",
                    1200, "frasco 400g", 86, "Productos Lácteos", null, null, "yogurt-natural.png")
    );

    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final CloudinaryService cloudinaryService;

    public ProductSeeder(ProductRepository productRepository, CategoryService categoryService,
                          CloudinaryService cloudinaryService) {
        this.productRepository = productRepository;
        this.categoryService = categoryService;
        this.cloudinaryService = cloudinaryService;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return; // Ya hay productos (reales o no): no se toca nada.
        }

        for (SeedProduct seed : PRODUCTOS) {
            Product product = new Product();
            product.setName(seed.nombre());
            product.setDescription(seed.descripcion());
            product.setPrice(seed.precio());
            product.setUnidadMedida(seed.unidad());
            product.setStock(seed.stock());
            product.setCategory(seed.categoria());
            product.setOrigin(seed.origen());
            product.setDescuento(seed.descuento());

            categoryService.findByName(seed.categoria())
                    .ifPresent(category -> product.setCode(categoryService.generarSiguienteCodigo(category)));

            try {
                byte[] imageBytes = new ClassPathResource("seed-images/" + seed.imagen())
                        .getInputStream().readAllBytes();
                String url = cloudinaryService.upload(imageBytes);
                if (url != null) {
                    product.setImageName(url);
                }
            } catch (IOException e) {
                logger.warn("No se pudo subir la imagen semilla '{}' para '{}': {}",
                        seed.imagen(), seed.nombre(), e.getMessage());
            }

            productRepository.save(product);
        }

        logger.info("ProductSeeder: catálogo inicial cargado ({} productos).", PRODUCTOS.size());
    }
}
