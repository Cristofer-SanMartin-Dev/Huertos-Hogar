package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Carpeta donde se guardarán las imágenes (en la raíz del proyecto)
    private final Path rootLocation = Paths.get("uploads");

    public ProductService() {
        try {
            Files.createDirectories(rootLocation); // Crea la carpeta si no existe
        } catch (IOException e) {
            throw new RuntimeException("No se pudo inicializar la carpeta de uploads", e);
        }
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Guardar producto CON imagen
    public Product saveProduct(Product product, MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            // Generar nombre único para evitar colisiones (ej: uuid_manzana.jpg)
            String uniqueFilename = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            
            // Guardar el archivo físico
            Files.copy(imageFile.getInputStream(), this.rootLocation.resolve(uniqueFilename));
            
            // Guardar el nombre en el objeto
            product.setImageName(uniqueFilename);
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

        // Si viene una nueva imagen, la guardamos y actualizamos
        if (imageFile != null && !imageFile.isEmpty()) {
            // (Opcional: Aquí podrías borrar la imagen antigua del disco)
            String uniqueFilename = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            Files.copy(imageFile.getInputStream(), this.rootLocation.resolve(uniqueFilename));
            product.setImageName(uniqueFilename);
        }

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}