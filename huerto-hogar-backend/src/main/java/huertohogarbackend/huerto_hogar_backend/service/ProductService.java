package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Guardar producto CON imagen
    public Product saveProduct(Product product, MultipartFile imageFile) throws IOException {
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
}
