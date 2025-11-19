// src/components/StarRating.jsx
import React from 'react';

/**
 * Componente reutilizable para mostrar estrellas.
 * CORRECCIÓN: Ahora maneja valores nulos, indefinidos o fuera de rango.
 */
const StarRating = ({ rating }) => {
  
  // 1. Validación de seguridad:
  // Convertimos a número (por si viene string) y si es null/undefined usamos 0.
  let safeRating = Number(rating) || 0;

  // 2. Protección de límites (Clamping):
  // Aseguramos que el número nunca sea menor a 0 ni mayor a 5.
  // Esto evita el error "Invalid array length" si la base de datos tiene un 6 o un -1.
  safeRating = Math.max(0, Math.min(5, safeRating));

  const fullStars = Math.floor(safeRating);
  const emptyStars = 5 - Math.ceil(safeRating);
  
  // Detecta si necesitamos dibujar media estrella
  const halfStar = (5 - fullStars - emptyStars) > 0;

  return (
    <div className="mb-2">
      <span className="text-warning">
        {/* Renderiza las estrellas llenas */}
        {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`}>★</span>)}
        
        {/* Renderiza la media estrella si aplica */}
        {halfStar && <span key="half">★</span>} 
        
        {/* Renderiza las estrellas vacías */}
        {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`}>☆</span>)}
      </span>
      
      {/* Muestra el número con 1 decimal */}
      <span className="text-muted ms-2">{safeRating.toFixed(1)}</span>
    </div>
  );
};

export default StarRating;