import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  
  const { image, name, price, description } = product;

  return (
    <div className="card h-100">
      <img src={image} className="card-img-top" alt={name} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text"><strong>Precio: ${price} CLP por kilo</strong></p>
        <button 
          onClick={() => addToCart(product)} 
          className="btn btn-primary mt-auto"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};