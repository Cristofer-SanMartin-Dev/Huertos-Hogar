// src/components/ReviewsModal.jsx
import React, { useState, useEffect } from 'react';
import StarRating from './StarRating.jsx';

const ReviewsModal = ({ product, show, onClose }) => {
  // TUTOR: Usamos useEffect para actualizar las reseñas si el producto cambia
  // mientras el modal ya está abierto (aunque es un caso raro, es buena práctica).
  const [reviews, setReviews] = useState(product ? product.reviews : []);
  const [newReviewText, setNewReviewText] = useState('');

  useEffect(() => {
    if (product) {
      setReviews(product.reviews);
    }
  }, [product]);

  if (!show || !product) {
    return null;
  }

  const handleAddReview = () => {
    if (newReviewText.trim()) {
      const newReview = {
        user: 'Tú (simulado)',
        date: new Date().toLocaleDateString('es-CL'),
        comment: newReviewText,
      };
      setReviews(prevReviews => [...prevReviews, newReview]);
      setNewReviewText('');
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <div className="flex-grow-1">
              <h5 className="modal-title" style={{ fontFamily: 'var(--font-header)' }}>{product.name}</h5>
              <StarRating rating={product.rating} />
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            
            <div className="mb-4 p-3 bg-light rounded">
              <h6 className="mb-3" style={{fontFamily: 'var(--font-header)'}}>Detalles del Producto</h6>
              <p className="mb-1"><strong>Origen:</strong> {product.origin}</p>
              <p className="mb-1"><strong>Sostenibilidad:</strong> {product.sustainability}</p>
              <p className="mb-1"><strong>Ideas de Recetas:</strong> {product.recipes.join(', ')}</p>
            </div>

            <h6 style={{fontFamily: 'var(--font-header)'}}>Reseñas de Clientes</h6>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-top pt-2 mt-2">
                  <strong>{review.user}</strong>
                  <small className="text-muted d-block">{review.date}</small>
                  <p className="mt-1 mb-0">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">Este producto aún no tiene reseñas. ¡Sé el primero!</p>
            )}
          </div>
          <div className="modal-footer d-block border-top pt-3">
            <h6 className="mb-2">Deja tu reseña</h6>
            <textarea
              className="form-control mb-2"
              rows="3"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              placeholder="Escribe tu opinión aquí..."
            ></textarea>
            <button onClick={handleAddReview} className="btn btn-primary w-100">Enviar Reseña</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;