package huertohogarbackend.huerto_hogar_backend.service;

import huertohogarbackend.huerto_hogar_backend.dto.ReviewRequest;
import huertohogarbackend.huerto_hogar_backend.model.Product;
import huertohogarbackend.huerto_hogar_backend.model.Review;
import huertohogarbackend.huerto_hogar_backend.model.User;
import huertohogarbackend.huerto_hogar_backend.repository.ProductRepository;
import huertohogarbackend.huerto_hogar_backend.repository.ReviewRepository;
import huertohogarbackend.huerto_hogar_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public Review addReview(Long productId, ReviewRequest dto, String requesterEmail) {
        if (dto.getRating() == null || dto.getRating() < 1 || dto.getRating() > 5) {
            throw new IllegalArgumentException("El rating debe estar entre 1 y 5.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + productId));

        User user = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + requesterEmail));

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());

        return reviewRepository.save(review);
    }

    public List<Review> listByProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId);
    }

    public Double getAverageRating(Long productId) {
        List<Review> reviews = listByProduct(productId);
        if (reviews.isEmpty()) {
            return null;
        }
        double sum = reviews.stream().mapToInt(Review::getRating).sum();
        return Math.round((sum / reviews.size()) * 10.0) / 10.0;
    }

    public Integer getReviewCount(Long productId) {
        return listByProduct(productId).size();
    }
}
