// src/components/StarRating.jsx
import React from 'react';

/**
 * TUTOR: Este es un componente reutilizable para mostrar estrellas.
 * - Recibe una prop: `rating` (un número, ej: 4.5).
 * - Calcula cuántas estrellas llenas, medias y vacías se deben mostrar.
 * - Renderiza los caracteres de estrellas (★ para llena, ☆ para vacía) para crear el efecto visual.
 * - También muestra el número de la valoración al lado para mayor claridad.
 */
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - Math.ceil(rating);
  const halfStar = 5 - fullStars - emptyStars > 0;

  return (
    <div className="mb-2">
      <span className="text-warning">
        {/* Renderiza las estrellas llenas */}
        {[...Array(fullStars)].map((_, i) => '★')}
        {/* Renderiza la media estrella si aplica */}
        {halfStar && '★'} 
        {/* Renderiza las estrellas vacías */}
        {[...Array(emptyStars)].map((_, i) => '☆')}
      </span>
      <span className="text-muted ms-2">{rating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;