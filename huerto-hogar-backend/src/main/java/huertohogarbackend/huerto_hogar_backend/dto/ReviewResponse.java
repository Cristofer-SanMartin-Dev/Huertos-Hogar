package huertohogarbackend.huerto_hogar_backend.dto;

import huertohogarbackend.huerto_hogar_backend.model.Review;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ReviewResponse {

    private Long id;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
    private String authorName;

    public static ReviewResponse from(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());
        response.setAuthorName(review.getUser().getNombre() + " " + review.getUser().getApellidos());
        return response;
    }
}
