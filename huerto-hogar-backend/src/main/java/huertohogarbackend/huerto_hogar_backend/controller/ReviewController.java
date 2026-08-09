package huertohogarbackend.huerto_hogar_backend.controller;

import huertohogarbackend.huerto_hogar_backend.dto.ReviewRequest;
import huertohogarbackend.huerto_hogar_backend.dto.ReviewResponse;
import huertohogarbackend.huerto_hogar_backend.model.Review;
import huertohogarbackend.huerto_hogar_backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping
    public List<ReviewResponse> getReviews(@PathVariable Long productId) {
        return reviewService.listByProduct(productId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> addReview(
            @PathVariable Long productId,
            @RequestBody ReviewRequest reviewRequest,
            @AuthenticationPrincipal UserDetails currentUser) {

        if (currentUser == null) {
            return ResponseEntity.status(401).body("Debes iniciar sesión para dejar una reseña.");
        }

        try {
            Review review = reviewService.addReview(productId, reviewRequest, currentUser.getUsername());
            return ResponseEntity.ok(ReviewResponse.from(review));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
