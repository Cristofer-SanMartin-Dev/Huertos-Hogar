import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom'; // 1. Importamos Link

export const CartWidget = () => {
  const { cart } = useContext(CartContext);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // 2. Envolvemos todo en un componente Link que apunta a "/cart"
  return (
    <Link to="/cart" className="d-flex align-items-center text-dark text-decoration-none">
      <span>🛒</span>
      {totalItems > 0 && (
        <span className="badge bg-danger ms-1">{totalItems}</span>
      )}
    </Link>
  );
};