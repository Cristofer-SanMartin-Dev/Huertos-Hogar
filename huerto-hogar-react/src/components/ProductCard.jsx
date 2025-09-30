// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext.jsx';
// 1. Importa el nuevo componente de estrellas
import StarRating from './StarRating.jsx';

const ProductCard = ({ product, onViewReviews }) => {
  const { name, price, description, stock, imageUrl, rating } = product; // Añadimos 'rating'
  const isOutOfStock = stock === 0;
  const { addToCart } = useCart();

  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        <img src={imageUrl} className="card-img-top" alt={name} style={{ height: '225px', objectFit: 'cover' }} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={{fontFamily: 'var(--font-header)'}}>{name}</h5>
          
          {/* 2. Añadimos el componente de valoración por estrellas */}
          <StarRating rating={rating} />
          
          <p className="card-text text-success fw-bold fs-5 mb-2">${price.toLocaleString('es-CL')}</p>
          <p className="card-text flex-grow-1">{description}</p>
          <div className="mt-auto">
            <p className={`fw-bold mb-2 ${isOutOfStock ? 'text-danger' : 'text-muted'}`}>
              {isOutOfStock ? 'Agotado' : `Stock: ${stock}`}
            </p>
            <div className="d-grid gap-2">
              <button
                className="btn btn-primary"
                disabled={isOutOfStock}
                onClick={() => addToCart(product)}
              >
                {isOutOfStock ? 'No disponible' : 'Agregar al carrito'}
              </button>
              <button onClick={() => onViewReviews(product)} className="btn btn-outline-secondary">
                Ver Reseñas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;