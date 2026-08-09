package huertohogarbackend.huerto_hogar_backend.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Integer rating; // 1 a 5
    private String comment;
}
