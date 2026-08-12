// Ruta: src/main/java/huertohogarbackend/huerto_hogar_backend/config/CategorySeeder.java
package huertohogarbackend.huerto_hogar_backend.config;

import huertohogarbackend.huerto_hogar_backend.model.Category;
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.repository.CategoryRepository;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Migración de arranque, idempotente:
 *  1) crea las categorías base si todavía no existen (se corrió antes de que
 *     existiera esta tabla, así que en producción parte vacía).
 *  2) le asigna un código (ej. FR001) a los productos que no tienen uno —
 *     los que ya existían antes de que se agregara el campo "code".
 *
 * No repite trabajo ya hecho (busca por nombre y filtra por code == null),
 * así que es seguro que corra en cada arranque del backend.
 */
@Component
public class CategorySeeder implements CommandLineRunner {

    private static final Map<String, String> CATEGORIAS_BASE = new LinkedHashMap<>();
    static {
        CATEGORIAS_BASE.put("Frutas Frescas", "FR");
        CATEGORIAS_BASE.put("Verduras Orgánicas", "VR");
        CATEGORIAS_BASE.put("Productos Orgánicos", "PO");
        CATEGORIAS_BASE.put("Productos Lácteos", "PL");
    }

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    public CategorySeeder(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        CATEGORIAS_BASE.forEach((nombre, prefijo) -> {
            if (categoryRepository.findByName(nombre).isEmpty()) {
                Category category = new Category();
                category.setName(nombre);
                category.setPrefix(prefijo);
                category.setNextSequence(1);
                categoryRepository.save(category);
            }
        });

        for (Category category : categoryRepository.findAll()) {
            List<Product> sinCodigo = productRepository.findByCategoryAndCodeIsNullOrderByIdAsc(category.getName());
            for (Product product : sinCodigo) {
                int secuencia = category.getNextSequence();
                product.setCode(category.getPrefix() + String.format("%03d", secuencia));
                category.setNextSequence(secuencia + 1);
                productRepository.save(product);
            }
            if (!sinCodigo.isEmpty()) {
                categoryRepository.save(category);
            }
        }
    }
}
