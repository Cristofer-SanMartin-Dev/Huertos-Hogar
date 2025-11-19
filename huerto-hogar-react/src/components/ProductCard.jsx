// src/components/ProductCard.jsx
import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import StarRating from './StarRating.jsx';
// 1. Importamos el servicio para obtener la URL base de las imágenes
import ProductService from '../services/productService.js';

const ProductCard = ({ product, onViewReviews }) => {
  // 2. Cambiamos 'imageUrl' por 'imageName' (así se llama en tu base de datos)
  const { name, price, description, stock, imageName, rating, priceUnit } = product;
  
  const isOutOfStock = stock === 0;
  const { addToCart } = useCart();

  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        {/* 3. Usamos el helper del servicio para construir la URL completa */}
        <img 
            src={ProductService.getImageUrl(imageName)} 
            className="card-img-top" 
            alt={name} 
            style={{ height: '225px', objectFit: 'cover' }} 
        />
        
        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={{fontFamily: 'var(--font-header)', color: 'var(--accent-brown)'}}>{name}</h5>
          
          {/* StarRating ya está protegido contra nulos gracias a la corrección anterior */}
          <StarRating rating={rating} />
          
          <p className="card-text text-success fw-bold fs-5 mb-2">
            ${price?.toLocaleString('es-CL')} 
            <span className="text-muted fs-6 fw-normal ms-2">{priceUnit || 'unidad'}</span>
          </p>

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
                Ver Detalles y Reseñas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;