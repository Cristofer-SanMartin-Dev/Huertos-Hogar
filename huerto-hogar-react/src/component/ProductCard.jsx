// src/components/ProductCard.jsx
import React from 'react';

/**
 * TUTOR: Este es uno de los componentes más importantes y reutilizables.
 * Representa una única "tarjeta" de producto.
 * - Recibe un objeto `product` como "prop" y muestra sus datos.
 * - La lógica para deshabilitar el botón si no hay stock se maneja aquí dentro.
 * - Es completamente independiente, por lo que podemos usarlo tanto en la página
 * de inicio como en la de catálogo de productos.
 */
const ProductCard = ({ product }) => {
  // Desestructuramos el objeto producto para un acceso más fácil
  const { name, price, description, stock, imageUrl } = product;
  const isOutOfStock = stock === 0;

  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        <img src={imageUrl} className="card-img-top" alt={name} style={{ height: '225px', objectFit: 'cover' }} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title" style={{fontFamily: 'var(--font-header)'}}>{name}</h5>
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
              >
                {isOutOfStock ? 'No disponible' : 'Agregar al carrito'}
              </button>
              <button className="btn btn-outline-secondary">
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