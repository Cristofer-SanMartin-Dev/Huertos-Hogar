package huertohogarbackend.huerto_hogar_backend.dto;

import huertohogarbackend.huerto_hogar_backend.model.Category;
import lombok.Data;

@Data
public class CategoryResponse {
    private Long id;
    private String name;
    private String prefix;

    public static CategoryResponse from(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setPrefix(category.getPrefix());
        return response;
    }
}
