package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.model.Category;
import huertohogarbackend.huerto_hogar_backend.repository.CategoryRepository;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> findByName(String name) {
        if (name == null) return Optional.empty();
        return categoryRepository.findByName(name);
    }

    public Category createCategory(String name, String prefix) {
        if (name == null || name.isBlank() || prefix == null || prefix.isBlank()) {
            throw new IllegalArgumentException("Nombre y prefijo son obligatorios.");
        }
        String nombreNormalizado = name.trim();
        String prefijoNormalizado = prefix.trim().toUpperCase();

        if (categoryRepository.existsByNameIgnoreCase(nombreNormalizado)) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre.");
        }
        if (categoryRepository.existsByPrefixIgnoreCase(prefijoNormalizado)) {
            throw new IllegalArgumentException("Ya existe una categoría con ese prefijo.");
        }

        Category category = new Category();
        category.setName(nombreNormalizado);
        category.setPrefix(prefijoNormalizado);
        category.setNextSequence(1);
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        boolean tieneProductos = !productRepository.findByCategory(category.getName()).isEmpty();
        if (tieneProductos) {
            throw new RuntimeException("No se puede eliminar una categoría con productos asociados.");
        }
        categoryRepository.delete(category);
    }

    /** Da el próximo código libre de esta categoría (ej. "FR003") y avanza su correlativo. */
    @Transactional
    public String generarSiguienteCodigo(Category category) {
        int secuencia = category.getNextSequence();
        category.setNextSequence(secuencia + 1);
        categoryRepository.save(category);
        return category.getPrefix() + String.format("%03d", secuencia);
    }
}
