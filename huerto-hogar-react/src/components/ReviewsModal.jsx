// src/components/ReviewsModal.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import StarRating from './StarRating.jsx';
import StarRatingInput from './StarRatingInput.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import reviewService from '../services/reviewService.js';

const ReviewsModal = ({ product, show, onClose }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Carga las reseñas reales del backend cada vez que se abre el modal
  // para un producto distinto.
  useEffect(() => {
    if (show && product) {
      reviewService.getByProduct(product.id)
        .then(response => setReviews(response.data))
        .catch(error => {
          console.error('Error al cargar reseñas:', error);
          setReviews([]);
        });
    }
  }, [show, product]);

  if (!show || !product) {
    return null;
  }

  const handleAddReview = () => {
    setSubmitError('');
    if (newRating < 1) {
      setSubmitError('Selecciona una calificación de 1 a 5 estrellas.');
      return;
    }
    if (!newComment.trim()) {
      setSubmitError('Escribe un comentario antes de enviar.');
      return;
    }

    setIsSubmitting(true);
    reviewService.create(product.id, { rating: newRating, comment: newComment })
      .then(response => {
        setReviews(prev => [response.data, ...prev]);
        setNewRating(0);
        setNewComment('');
        toast.success('¡Gracias por tu reseña!');
      })
      .catch(error => {
        console.error('Error al publicar la reseña:', error);
        setSubmitError(error.response?.data || 'No se pudo publicar la reseña.');
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <div className="flex-grow-1">
              <h5 className="modal-title" style={{ fontFamily: 'var(--font-header)' }}>{product.name}</h5>
              <StarRating rating={product.averageRating} />
            </div>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">

            <div className="mb-4 p-3 bg-light rounded">
              <h6 className="mb-3" style={{fontFamily: 'var(--font-header)'}}>Detalles del Producto</h6>
              <p className="mb-1"><strong>Origen:</strong> {product.origin || 'No especificado'}</p>
              <p className="mb-1"><strong>Sostenibilidad:</strong> {product.sustainability || 'No especificado'}</p>
              {product.recipes && (
                <p className="mb-1"><strong>Ideas de Recetas:</strong> {product.recipes}</p>
              )}
            </div>

            <h6 style={{fontFamily: 'var(--font-header)'}}>Reseñas de Clientes</h6>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="border-top pt-2 mt-2">
                  <StarRating rating={review.rating} />
                  <strong>{review.authorName}</strong>
                  <small className="text-muted d-block">
                    {new Date(review.createdAt).toLocaleDateString('es-CL')}
                  </small>
                  <p className="mt-1 mb-0">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">Este producto aún no tiene reseñas. ¡Sé el primero!</p>
            )}
          </div>
          <div className="modal-footer d-block border-top pt-3">
            {isAuthenticated ? (
              <>
                <h6 className="mb-2">Deja tu reseña</h6>
                <div className="mb-2">
                  <StarRatingInput value={newRating} onChange={setNewRating} />
                </div>
                <textarea
                  className="form-control mb-2"
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe tu opinión aquí..."
                ></textarea>
                {submitError && <div className="alert alert-danger py-2">{submitError}</div>}
                <button onClick={handleAddReview} className="btn btn-primary w-100" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
                </button>
              </>
            ) : (
              <p className="text-muted mb-0">
                <Link to="/login" onClick={onClose}>Inicia sesión</Link> para dejar una reseña.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsModal;
