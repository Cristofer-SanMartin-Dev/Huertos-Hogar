import React from 'react';

export const CartWidget = () => {
  return (
    <div className="d-flex align-items-center">
      {/* En el futuro, este ícono podría ser un SVG o de una librería de íconos */}
      <span>🛒</span>
      {/* El número de items en el carrito será dinámico más adelante */}
      <span className="badge bg-danger ms-1">0</span>
    </div>
  );
};