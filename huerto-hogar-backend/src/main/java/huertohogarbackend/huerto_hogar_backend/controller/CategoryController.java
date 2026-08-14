package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.config.OpenApiConfig;
import huertohogarbackend.huerto_hogar_backend.dto.CategoryRequest;
import huertohogarbackend.huerto_hogar_backend.dto.CategoryResponse;
import huertohogarbackend.huerto_hogar_backend.dto.ErrorResponse;
import huertohogarbackend.huerto_hogar_backend.model.Category;
import huertohogarbackend.huerto_hogar_backend.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@Tag(name = "Categorías", description = "Categorías de producto, cada una con un prefijo (ej. FR) que alimenta el código autogenerado de sus productos. Lectura pública; crear y eliminar requieren rol ADMIN.")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Listar todas las categorías")
    public List<CategoryResponse> getAllCategories() {
        return categoryService.getAllCategories().stream()
                .map(CategoryResponse::from)
                .toList();
    }

    @PostMapping
    @Operation(
            summary = "Crear una categoría",
            description = "El prefijo se normaliza a mayúsculas (ej. \"co\" → \"CO\"). Tanto el nombre como el prefijo deben ser únicos entre las categorías existentes."
    )
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoría creada"),
            @ApiResponse(responseCode = "400", description = "Nombre/prefijo vacíos, o ya existe una categoría con ese nombre o prefijo"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido"),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN")
    })
    public ResponseEntity<?> createCategory(@RequestBody CategoryRequest request) {
        try {
            Category category = categoryService.createCategory(request.getName(), request.getPrefix());
            return ResponseEntity.ok(CategoryResponse.from(category));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar una categoría", description = "Solo se puede eliminar si no tiene productos asociados actualmente.")
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Categoría eliminada"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido"),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN"),
            @ApiResponse(responseCode = "409", description = "La categoría tiene productos asociados, no se puede eliminar")
    })
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(new ErrorResponse(e.getMessage()));
        }
    }
}
