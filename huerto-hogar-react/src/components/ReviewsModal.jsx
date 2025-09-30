// src/components/ReviewsModal.jsx
import React, { useState } from 'react';

/**
 * TUTOR: Este componente representa la ventana modal para las reseñas.
 * - Recibe 3 props:
 * 1. `product`: El objeto del producto seleccionado para mostrar su nombre y reseñas.
 * 2. `show`: Un booleano que determina si el modal está visible o no.
 * 3. `onClose`: Una función que se llama para cerrar el modal.
 * - `useState`: Usamos `newReviewText` para controlar el contenido del <textarea>
 * y `reviews`, que es una copia de las reseñas del producto, para poder añadir nuevas
 * de forma simulada sin modificar los datos originales.
 * - El modal se muestra u oculta cambiando la clase CSS, basado en la prop `show`.
 */
const ReviewsModal = ({ product, show, onClose }) => {
  const [reviews, setReviews] = useState(product ? product.reviews : []);
  const [newReviewText, setNewReviewText] = useState('');

  // Si no hay producto o no se debe mostrar, no renderizamos nada.
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
      setReviews([...reviews, newReview]);
      setNewReviewText(''); // Limpiamos el textarea
    }
  };

  return (
    // Overlay oscuro de fondo
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ fontFamily: 'var(--font-header)' }}>Reseñas de {product.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {/* Lista de reseñas */}
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-bottom pb-2 mb-2">
                  <strong>{review.user}</strong>
                  <small className="text-muted d-block">{review.date}</small>
                  <p className="mt-1 mb-0">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-muted">Este producto aún no tiene reseñas. ¡Sé el primero!</p>
            )}
          </div>
          <div className="modal-footer d-block">
            {/* Formulario para añadir nueva reseña */}
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