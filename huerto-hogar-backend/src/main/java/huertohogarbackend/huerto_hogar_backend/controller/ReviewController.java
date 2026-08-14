package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.config.OpenApiConfig;
import huertohogarbackend.huerto_hogar_backend.dto.ErrorResponse;
import huertohogarbackend.huerto_hogar_backend.dto.ReviewRequest;
import huertohogarbackend.huerto_hogar_backend.dto.ReviewResponse;
import huertohogarbackend.huerto_hogar_backend.model.Review;
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

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
@Tag(name = "Reseñas", description = "Reseñas y calificación (1-5 estrellas) de un producto. Lectura pública; publicar una reseña requiere sesión (cualquier rol).")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    @Operation(summary = "Listar las reseñas de un producto", description = "Ordenadas de la más reciente a la más antigua.")
    public List<ReviewResponse> getReviews(@Parameter(description = "Id del producto") @PathVariable Long productId) {
        return reviewService.listByProduct(productId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @PostMapping
    @Operation(summary = "Publicar una reseña", description = "Cualquier usuario autenticado puede reseñar cualquier producto (no se valida que lo haya comprado).")
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Reseña publicada"),
            @ApiResponse(responseCode = "400", description = "La calificación (rating) debe estar entre 1 y 5"),
            @ApiResponse(responseCode = "401", description = "Falta el token o no es válido"),
            @ApiResponse(responseCode = "404", description = "No existe un producto con ese id")
    })
    public ResponseEntity<?> addReview(
            @Parameter(description = "Id del producto") @PathVariable Long productId,
            @RequestBody ReviewRequest reviewRequest,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(401).body(new ErrorResponse("Debes iniciar sesión para dejar una reseña."));
        }

        try {
            Review review = reviewService.addReview(productId, reviewRequest, currentUser.getUsername());
            return ResponseEntity.ok(ReviewResponse.from(review));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        }
    }
}
