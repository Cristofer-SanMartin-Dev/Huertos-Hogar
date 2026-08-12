package huertohogarbackend.huerto_hogar_backend.dto;

import huertohogarbackend.huerto_hogar_backend.model.Product;
import lombok.Data;

/**
 * Forma de lectura de un producto para el catálogo público.
 *
 * Incluye campos calculados (precio con descuento, rating promedio) que no
 * viven en la entidad. Se usa solo en las respuestas de lectura (GET); crear
 * y actualizar siguen trabajando directamente con la entidad Product.
 */
@Data
public class ProductResponse {

    private Long id;
    private String code;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String category;
    private String imageName;
    private String origin;
    private String sustainability;
    private String recipes;
    private Integer descuento;
    private String unidadMedida;
    private Double precioConDescuento;
    private Double averageRating;
    private Integer reviewCount;

    public static ProductResponse from(Product product, Double averageRating, Integer reviewCount) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setCode(product.getCode());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStock(product.getStock());
        response.setCategory(product.getCategory());
        response.setImageName(product.getImageName());
        response.setOrigin(product.getOrigin());
        response.setSustainability(product.getSustainability());
        response.setRecipes(product.getRecipes());
        response.setDescuento(product.getDescuento());
        response.setUnidadMedida(product.getUnidadMedida());

        if (product.getDescuento() != null && product.getDescuento() > 0 && product.getPrice() != null) {
            response.setPrecioConDescuento(product.getPrecioFinal());
        }

        response.setAverageRating(averageRating);
        response.setReviewCount(reviewCount);
        return response;
    }
}
