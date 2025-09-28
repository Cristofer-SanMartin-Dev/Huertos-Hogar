import React, { useState } from 'react';

const ProductReviewsModal = ({ product, show, onClose, onAddReview }) => {
  const [reviewText, setReviewText] = useState('');

  if (!show || !product) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <h6>Reseñas</h6>
            <ul className="list-group mb-3">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <li key={idx} className="list-group-item">
                    <strong>{review.user}</strong> <span className="text-muted">({review.date})</span><br />
                    {review.comment}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No hay reseñas aún.</li>
              )}
            </ul>
            <h6>Deja tu reseña</h6>
            <textarea
              className="form-control mb-2"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Escribe tu opinión aquí..."
            />
            <button
              className="btn btn-success"
              onClick={() => {
                if (reviewText.trim()) {
                  onAddReview(reviewText);
                  setReviewText('');
                }
              }}
            >Enviar Reseña</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewsModal;
