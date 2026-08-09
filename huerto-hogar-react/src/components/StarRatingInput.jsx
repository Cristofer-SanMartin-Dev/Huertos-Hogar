// src/components/StarRatingInput.jsx
import React from 'react';

/**
 * Selector de estrellas clicable (1 a 5), para publicar una reseña.
 * A diferencia de StarRating (solo lectura), cada estrella es un botón.
 */
const StarRatingInput = ({ value, onChange }) => {
  return (
    <div role="radiogroup" aria-label="Calificación">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
          onClick={() => onChange(star)}
          className="btn btn-link p-0 me-1"
          style={{ fontSize: '1.5rem', textDecoration: 'none', lineHeight: 1 }}
        >
          <span className="text-warning">{star <= value ? '★' : '☆'}</span>
        </button>
      ))}
    </div>
  );
};

export default StarRatingInput;
